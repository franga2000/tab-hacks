// ==UserScript==
// @name				Tabbycat tools
// @match			 http*://tab*.*/*
// @match			 http*://*.calicotab.com/*
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

/*
 * GLOBAL STYLES
 */

{
  let $style = document.createElement("style");
  $style.innerHTML = `

/* big checkboxes */
table .form-check-input {
  scale: 1.6;
}

/* block banner ad */
#pageTitle > .col-md:last-child {
  display: none;
}

`;
  document.head.append($style);
}

/*
 * WHERE TO RUN WHAT
 */

reverseTitle();

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

if (!window.location.href.includes("/admin")) {
  hideAds()
}

if (window.location.href.includes("/database")) {
  warnNoTournamentFilter()
}

if (window.location.href.includes("conflicts/adjudicator-institution/")) {
  searchableConflicts()
}

/*
 * ACTUAL CODE
 */

/**
 * Hide ads on the frontend.
 * NOTE: while I understand the choice to run ads and don't have too much of a problem withparticipants
 * participants seeing them when looking at the public pages on their own, I do not feel comfortable displaying
 * these ads when projecting my screen to the crowd at a tournament.
 * This script is made for use by tabmasters, not participants, so they're not the target audience anyways.
 */
function hideAds() {
  for (let $img of document.getElementsByTagName("img")) {
    if ($img.src.includes("promotion")) {
      $img.remove();
    }
  }
}

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

/**
 * Append the value of every dropdown to its label, so it becomes CTRL+F searchable.Append
 * Useful when you need to find a specific person in a long list of auto-generated conflicts.
 */
function searchableConflicts() {
  for (let $sel of document.querySelectorAll("select")) {
    let $lab = $sel.parentElement.querySelector("label");
    $lab.textContent += " (" + $sel.options[$sel.selectedIndex].text + ")";
  }
}

/**
 * Make it obvious when a participants page in the admin isn't filtered by tournament.
 * This is to ensure you don't accidentally run a batch action on all participants instead of just the current tournament.
 */
function warnNoTournamentFilter() {
  if (window.location.href.includes("/participants/") && ! window.location.href.includes("tournament__id")) {
    document.getElementById("content").style.backgroundColor = "rgba(255, 0, 0, .2)"
  }
}
