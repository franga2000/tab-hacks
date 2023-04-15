// ==UserScript==
// @name				Tabbycat tools
// @match			 http*://tab*.*/*
// @grant			 unsafeWindow
// @grant			 GM_registerMenuCommand
// @version		 1.0
// @author			franga2000
// @description A collection of horrible hacks for lazy tabmasters
// ==/UserScript==

/*
 * COMMAND REGISTRATION
 */
GM_registerMenuCommand('Make tables plain', () => plainTables(document), 'r');


{
  let $style = document.createElement("style");
  $style.innerHTML = `
table .form-check-input {
  scale: 1.6;
}
  `;
  document.head.append($style);
}

/*
 * WHERE TO RUN WHAT
 */

//reverseTitle();

if (window.location.href.endsWith("/participants/eligibility/")) {
	addBatchToggler()
}

if (window.location.href.includes("/checkins/identifiers/print/")) {
	addIdentifierExporter()
}


if (window.location.href.includes("/checkins/status/")) {
	addCheckinClearer()
}

if (window.location.href.endsWith("/break/eligibility/")) {
  GM_registerMenuCommand('Add team member count', () => addTeamSizes(document), 'r');
}

/*
 * ACTUAL CODE
 */

/**
 * Reverse the title so they're more readable in short tabs that get truncated
 */
function reverseTitle() {
	let parts = document.title.split("|").map(s => s.trim());
	parts.reverse();
	document.title = parts.join(" | ")
}


/**
 * Strip anything fancy out of a table so it's easier to copy-paste
 */
function plainTables(el) {
	[...el.querySelectorAll("td")].forEach(e => {
    let txt;
    let span = e.querySelector("span");
    if (span) {
      txt = span.textContent;
    } else {
      txt = e.children[0].textContent;
    }
    e.innerHTML = txt
  })
}

/**
 * Add a field that you can paste names into and it will find them in the table and click their checkmarks
 * (useful for importing novice speakers)
 * NOTE: this is horrible Only clicks the first checkbox, can only toggle (not set) them and runs async so DON'T CLOSE THE TAB unless you're sure it's done
 */
function addBatchToggler() {
	document.querySelector("footer").outerHTML += `
	<div class="input-group">
	  <label>Batch-toggle names</label>
	  <textarea class="form-control" id="batch-toggle-list"></textarea>
	  <div class="input-group-append" id="batch-toggle"><span class="input-group-text">GO</span></div>
	</div>`;

	document.getElementById("batch-toggle").onclick = function(ev) {
	  let cat_num = 1;
	  let list = document.getElementById("batch-toggle-list").value.split("\n").map(s => s.trim());
	  console.debug(list);
	  let c = 0;

	  for (let tr of document.querySelectorAll(".table tr")) {
		  let i = list.indexOf(tr.children[0].textContent.trim());
		  if (i > 0) {
		  setTimeout( () => {
			  tr.querySelectorAll("input[type=checkbox]")[cat_num].click();
		  }, 100*c);
		  list.splice(i,i);
		  }
	  }

	  alert("missing:" + list.join("\n"));
	}
}


function addIdentifierExporter() {
  document.getElementById("pageTitle").innerHTML += `<button id="exportButton">Export identifiers</button>`;
  document.getElementById("exportButton").onclick = () => {
	let data = $(".card-footer small").get().map(e => e.textContent.split(", "));

	let html = `<table>
	<tr>
		<th>Name</th>
		<th>Identifier</th>
	</tr>`;
	for (let [name, code] of data) {
		html += `
		<tr>
			<td>${name}</td>
			<td>${code}</td>
		</tr>`;
	}
	html += `</table>`;

	var wnd = window.open("about:blank", "", "_blank");
	wnd.document.write(html);

  }
}

function addCheckinClearer() {
  document.getElementById("pageTitle").innerHTML += `<button id="clearCheckins">Clear all</button>`;
  document.getElementById("clearCheckins").onclick = () => {
	[...document.querySelectorAll("button.btn-secondary")].filter(e => e.textContent == "☓ All").forEach(e => e.click())

  }
}

function addTeamSizes() {
  for (let $team of document.querySelectorAll(".team-name")) {
    let members = $team.querySelector(".list-group-item > span").textContent;
    let count = members.split(",").length;
    $team.querySelector(".flex-vertical-center [data-toggle]").style.flex = "1";
    let $count = document.createElement("span");
    $count.textContent = "(" + count + ")";
    $team.querySelector(".flex-vertical-center").append($count);
  }
}
