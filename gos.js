(function() {
	var css = [
		"http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css", 
		"http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css",
		"http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-theme.min.css",
		"style.css"
	];
	var js = [
		"http://code.jquery.com/jquery-1.9.1.js", 
		"http://code.jquery.com/ui/1.10.3/jquery-ui.js", 
		"https://raw.github.com/wycats/handlebars.js/1.0.0/dist/handlebars.js", 
		"http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js",
		"gos-core.js?id="+Math.random()
	];
	
	
	var loadDoc = function(head, type, attr, success, scope) {
			var script = document.createElement(type);
			var done = false;
			script.onload = script.onreadystatechange = function() {
				if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
					script.onload = script.onreadystatechange = null;
					if(typeof success == 'function') {
						success.apply(this||scope, arguments);
					}
				}
			};
			for(var k in attr) {
				script[k] = attr[k];
			}
			head.appendChild(script);
	};
	
	var loadJs = function(url, callback, scope) {
	console.log('loadJs', url);
		var head = document.getElementsByTagName('head')[0];
		loadDoc(head, 'script', {type: 'text/javascript', src: url}, callback, scope);
	}
	var loadCss = function(url) {
		var head = document.getElementsByTagName('head')[0];
		var attr = {type: "text/css", rel: "stylesheet", href: url, media: "all"};
		loadDoc(head, 'link', attr);
	}
	var onReady = function() {
		for(var i=0; i<css.length; i++) {
			loadCss(css[i]);
		}
		var scripts = js.map(function(_) {
			return {url: _};
		});
		for(var i=0; i<scripts.length-1; i++) {
			scripts[i].next = scripts[i+1];
		}
		
		var onScriptLoaded = function() {
			console.log('onScriptLoaded', this, this.next);
			var next = this.next;
			if(next) {
				loadJs(next.url, onScriptLoaded.bind(next));
			}
		}; 
		loadJs(scripts[0].url, onScriptLoaded.bind(scripts[0]));
	}
	
	

/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
var contentLoaded = function(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

};
contentLoaded(window, function() {
	onReady.call(this, arguments);
});
})();