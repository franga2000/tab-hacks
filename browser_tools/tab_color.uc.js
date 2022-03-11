// ==UserScript==
// @name            Tabbycat color
// @author          franga2000
// @include         main
// @include         chrome://browser/content/places/browser.xhtml
// @startup         UC.tabColor.exec(win);
// ==/UserScript==
UC.tabColor = {
	update: function(document) {
		console.debug(document)

		let style = document.querySelector("#tab-color-style");
		if (style == null) {
			style = document.createElement("style");
			style.id = "tab-color-style";
			document.head.appendChild(style)
		}

		UC.tabColor.$style = style;

		data = {
			tabby_si: {
				tabBackground: "rgba(50,50,255,.3)",
				tabActiveBackground: "rgba(50,50,255,.5)",
				titleRegex: /.+\|.+-(ss|SS)/,
			},
			tabby_en: {
				tabBackground: "rgba(255,50,50,.3)",
				tabActiveBackground: "rgba(255,50,50,.5)",
				titleRegex: /(EN|en)-/,
			},
			tabby_div1: {
				tabBackground: "rgba(217, 210, 233, .5)",
				tabActiveBackground: "rgba(217, 210, 233, .5)",
				titleRegex: /Div 1/,
			},
			tabby_div2: {
				tabBackground: "rgba(255, 242, 204, .5)",
				tabActiveBackground: "rgba(255, 242, 204, .5)",
				titleRegex: /Div 2/,
			},
		}

		let stylesheet = "";
		for (let key in data) {
			let settings = data[key];
			if (settings.tabBackground !== undefined)
				stylesheet += `
                tab.tabstyle-${key} .tab-background {
                    background: ${settings.tabBackground}
                }
                `
			if (settings.tabActiveBackground !== undefined)
				stylesheet += `
                tab.tabstyle-${key} .tab-background[selected="true"] {
                    background-image: unset !important;
                    background: ${settings.tabActiveBackground} !important;
                }
                `
		}
		UC.tabColor.$style.innerHTML = stylesheet;

		for (let tab of [...document.querySelectorAll("tab")]) {
			for (let key in data) {
				let settings = data[key];
				console.debug(settings, tab.label, settings.titleRegex.exec(tab.label))
				if (settings.titleRegex !== undefined && settings.titleRegex.exec(tab.label) !== null) {
					tab.classList.add("tabstyle-" + key);
					console.debug(key, tab.label)
				} else
					tab.classList.remove("tabstyle-" + key);
			}
		}

	},

	exec: function(win) {
		_uc.windows((document, window, location) => {
			console.debug(document);
			document.querySelector("#navigator-toolbox").onclick = () => UC.tabColor.update(document);
			document.querySelector(".urlbar-input-box").onchange = () => UC.tabColor.update(document);
		});
	},

}
