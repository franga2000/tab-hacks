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


/*
 * WHERE TO RUN WHAT
 */

reverseTitle();

if (window.location.href.endsWith("/participants/eligibility/") || window.location.href.endsWith("/adjudicators/")) {
	addBatchToggler()
}


/*
 * ACTUAL CODE
 */

/**
 * Reverse the title so they're more readable in short tabs that get truncated
 */
function reverseTitle() {
	if (window.location.href.includes("/database/"))
		return;
	let parts = document.title.split("|").map(s => s.trim());
	parts.reverse();
	document.title = parts.join(" | ")
}


/**
 * Strip anything fancy out of a table so it's easier to copy-paste
 */
function plainTables(el) {
	//[...el.querySelectorAll("td")].forEach(e => e.innerHTML = e.children[0].textContent)
	[...el.querySelectorAll("td")].forEach(e => e.innerHTML = e.querySelector("span").textContent)
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
		let list = document.getElementById("batch-toggle-list").value.split("\n").map(s => s.trim());
		console.debug(list);
		let c = 0;

		let toClick = [];
		for (let tr of document.querySelectorAll(".table tr")) {
			let txt = tr.textContent.trim();
			for (let name of list) {
				console.log(txt);
				let i = txt.indexOf(name);
				if (i != -1) {
					toClick.push(tr.querySelector("input[type=checkbox]"));
					//list.splice(i,i);
					break;
				}
			}
		}
		//alert("missing:" + list.join("\n"));
		alert("Found:" + toClick.length)
		let i = 0;

		function clickNext() {
			toClick[i].click();
			i++;
			if (i < toClick.length)
				setTimeout(clickNext, 500);
			else
				alert("Done!");
		}
		clickNext();


	}
}
