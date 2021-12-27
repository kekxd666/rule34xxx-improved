// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw, kekxd
// @match        https://rule34.xxx/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABeAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAAlwSFlzAAALEwAACxMBAJqcGAAAARBJREFUOMudkjFOw0AQRd86mxugNCTyRaxIkZyCii5FOm5gi3NY5gacgcqFKX0R5NBE3CDgT7XW2llsYCTLO//P35n9u0aSedq8dvwjsjaNrBNnbdoTxhgAynUdEvU8m7qLfNB9kgDIT/srsR/d4pPI7zgzbrDO+kkRV38Su3OqXNfyAxDQ4y4v4mqQA7Jj4wAkYYwhP+3JUO+JzzuNnTv7eHS3+cCDrE3JTdgDH3t8uwub6F/d1K2MGxRxhZ0ShSZydY6z7sWNH00RV7y8Pw+w+9uHa65c19pFR300XwJ0bi4CtLWHfj2FRW73m2TBubmwSpZs7QGAVbKcx9wEv+kWwpBkdtGxL3B/f/0TJsl8A8Ga1pJm8pdUAAAAAElFTkSuQmCC
// ==/UserScript==

// Tested on: Violent Monkey
// If you want to edit settings, go to the options page of your account...

function getSetting(settingName, settingDefault) {
	let value = GM_getValue(settingName, null);
	if (value == null) { GM_setValue(settingName, settingDefault); value = settingDefault; }
	return value;
}

var autoplayVideos_            = "autoplayVideos";            var autoplayVideos            = getSetting(autoplayVideos_            , false);
var defaultVideoVolume_        = "defaultVideoVolume";        var defaultVideoVolume        = getSetting(defaultVideoVolume_        , 1);
var useViewportDependentSize_  = "useViewportDependentSize";  var useViewportDependentSize  = getSetting(useViewportDependentSize_  , true);
var viewportDependentHeight_   = "viewportDependentHeight";   var viewportDependentHeight   = getSetting(viewportDependentHeight_   , 70);
var stretchImgVid_             = "stretchImgVid";             var stretchImgVid             = getSetting(stretchImgVid_             , true);
var trueVideoSize_             = "trueVideoSize";             var trueVideoSize             = getSetting(trueVideoSize_             , false);
var enableFavOnEnter_          = "enableFavOnEnter";          var enableFavOnEnter          = getSetting(enableFavOnEnter_          , true);
var hideBlacklistedThumbnails_ = "hideBlacklistedThumbnails"; var hideBlacklistedThumbnails = getSetting(hideBlacklistedThumbnails_ , true);
var forceDarkTheme_            = "forceDarkTheme";            var forceDarkTheme            = getSetting(forceDarkTheme_            , true);
var betterDarkTheme_           = "betterDarkTheme";           var betterDarkTheme           = getSetting(betterDarkTheme_           , true);
var removeBloat_               = "removeBloat";               var removeBloat               = getSetting(removeBloat_               , true);
var endlessScrolling_          = "endlessScrolling";          var endlessScrolling          = getSetting(endlessScrolling_          , true);
var favFilter_                 = "favFilter";                 var favFilter                 = getSetting(favFilter_                 , true);
var showFavPosts_              = "showFavPosts";              var showFavPosts              = getSetting(showFavPosts_              , true);
var showFavPosts2_             = "showFavPosts2";             var showFavPosts2             = getSetting(showFavPosts2_             , false);
var embedVideo_                = "embedVideo";                var embedVideo                = getSetting(embedVideo_                , true);
var thumbFav_                  = "thumbFav";                  var thumbFav                  = getSetting(thumbFav_                  , true);
var mainPageExtra_             = "mainPageExtra";             var mainPageExtra             = getSetting(mainPageExtra_             , true);


var rootCss = `:root { --favdisplay: inline; }`;
GM_addStyle(rootCss);

var betterDarkThemeCss = `
* { --c-bg: #101010; --c-bg-alt: #101010; --c-bg-highlight: #202020; }
body { background-image: none !important; color: white !important; background-color: #101010 !important }
table.highlightable td { border-color: #023C00; }
input[type="text"], input[type="password"], input[type="email"], textarea, select { color: lime; background-color: black; border-color: green; border-style:solid; margin: 1px;}
input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, textarea:focus, select:focus { background-color: #101010 !important; }

.awesomplete [hidden] { display: none }
.awesomplete .visually-hidden { position: absolute; }
.awesomplete { display: inline-block; position: relative }
.awesomplete>input { display: block }
.awesomplete>ul:empty { display:none }
.awesomplete>ul {
	position: absolute;
	z-index: 1;
	min-width: 100%;
	box-sizing: border-box;
	list-style: none;
	padding: 0;
	margin: 0;
	background: black;
	padding: 3px;
	margin: 0;
	color: hotpink;
	background: linear-gradient(to top left, #002404, black);
	border-color: lime;
	border-width: 1px;
	text-shadow: none;
}
@supports(transform:scale(0)) {
	.awesomplete>ul { transition:.1s cubic-bezier(1,1,1,1); transform-origin:1.43em -.43em; }
	.awesomplete>ul[hidden],
	.awesomplete>ul:empty { opacity: 0; transform: scale(0); display: block; ransition-timing-function: ease; }
}
.awesomplete>ul:before { display: none }
.awesomplete>ul>li                       { cursor:pointer; color: hotpink; background: transparent; border: 1px solid transparent; position: relative; padding: 1px; }
.awesomplete>ul>li:hover                 { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid transparent; }
.awesomplete>ul>li[aria-selected=true]   { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid lime; }
.awesomplete mark                        { cursor:pointer; color: lime; background: transparent; }
.awesomplete li:hover mark               { cursor:pointer; color: lime; background: transparent; }
.awesomplete li[aria-selected=true] mark { cursor:pointer; color: lime; background: transparent; }

.slider {
	margin: 0 5px 0 5px;
	padding: 0;
	display: inline-block;
	-webkit-appearance: none;
	width: 60%;
	height: 10px;
	border-radius: 5px;
	border: solid 1px green;
	background: #101010;
	opacity: 0.8;
	-webkit-transition: .1s;
	transition: opacity .1s;
}

.slider:hover { opacity: 1; }

.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}

.slider::-moz-range-thumb {
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}

#delayRange { width: 25% !important; }


.button-remove {
	background-color: transparent;
	border: none;
	color: gray;
	cursor: pointer;
}

.button-remove:active {
    filter: none !important;
	color: black;
	background-color: gray;
	border-radius: 5px;
}

.checkboxContainer {
	display: inline-block;
	position: relative;
	padding-left: 15px;
	margin-bottom: 5px;
	margin-right: 5px;
	cursor: pointer;
	font-size: 22px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	height: 35px;
	width: 20px;
}

#trcheckbox {
	width: 15px;
	height: 15px;
	right: 1px;
	top: 1px;
	padding: 0;
	margin: 0px 15px 0px px;
}

#trcheckbox .checkmark {
	height: 13px;
	width: 13px;
	padding: 0 !important;
	margin: 0 !important;
}

/* Hide the browser's default checkbox */
.checkboxContainer input {
	top: 4px;
	left: 6px;
	position: absolute;
	opacity: 0;
	cursor: pointer;
	height: 0;
	width: 0;
}

/* Create a custom checkbox */
.checkmark {
	position: absolute;
	top: 3px;
	left: 5px;
	height: 25px;
	width: 25px;
	background-color: #202020;
	border: 2px green solid;
	border-radius: 3px;
	transition: all .2s ease;
}

.checkboxContainer:hover input ~ .checkmark { background-color: #404040; }
.checkboxContainer input:checked ~ .checkmark { background-color: lime; }
.checkboxContainer input:checked ~ .checkmark:after { display: block; }

`;

var postCss = `
#postbar { 
	margin: 0;
	padding 30px;
	border: solid 1px var(--c-link-soft);
	display: inline-block;
	width: auto;
	background-color: var(--c-bg-highlight);
}

.custom-button {
	background-color: transparent;
	cursor: pointer;
	width: auto;
	padding: 3px;
	margin: 1px;
	border-radius: 20px;
}
.custom-button:hover  { background-color: rgba(100,255,100,.2); }
.custom-button:active { background-color: rgba(255,255,255,1);  }

#isinfav, #isinfav2 {
	display: inline-block;
	margin-left: 10px;
	font-size: 18px;
	background-color: pink;
	border: 1px deeppink solid;
}

` + (useViewportDependentSize ?
	((stretchImgVid ? `
#gelcomVideoContainer {
	width: auto !important;
	max-width: 100% !important;
	height: ` + viewportDependentHeight + `vh !important;
}` : "") + `
#image {
	width: auto !important;
	max-width: 100% !important;
	` + (stretchImgVid ? "" : "max-") + `height: ` + viewportDependentHeight + `vh !important;
}`) : "");

var favedPostStyle = `
	display: var(--favdisplay);
	background: linear-gradient(to bottom, hotpink, purple);
	opacity: 0.4;
`;

var heartStyle = `
	position: absolute;
	text-align: left;
	font-size: 20px;
	opacity: 0.8;
`;

var expandButtonStyle = `
	position: fixed;
	top: 5px;
	right: 5px;
	cursor: pointer;
	border: darkgreen 2px dashed;
	width: 20px;
	height: 20px;
	text-align: center;
`;

// add custom css to show that the post is in fav
function showFavPosts_check(element) {

	if (element == null || element.className == "thumb fav" || !GM_getValue("favlist", []).includes(getPostID(element))) { return }

	let heart = document.createElement("div");
	heart.style = heartStyle;
	heart.title = "Post is in Favorites.";
	heart.innerHTML = "❤️";
	element.className = "thumb fav";
	element.appendChild(heart);
	element.style = favedPostStyle;

	if (thumbFav) {
		element.onmouseenter = null;
		element.onmouseleave = null;
	}
}

function updateNavbar_p1(postID) {
	let navbar = document.getElementById("subnavbar");
	for (let i = 0; i < navbar.childNodes.length; i++) { if (navbar.childNodes[i].id == "isinfav") { return; } }
	if (GM_getValue("favlist", []).includes(postID)) {
		let div = document.createElement("div");
		div.id = "isinfav";
		div.title = "Post is in Favorites."
		div.innerHTML = "❤️";
		navbar.appendChild(div);
	}
}

function updateNavbar_p2(postID) {
	let navbar = document.getElementById("subnavbar");
	for (let i = 0; i < navbar.childNodes.length; i++) { if (navbar.childNodes[i].id == "isinfav2") { return; } }

	let favlist = GM_getValue("favlist2", []);
	let cont = false;
	for (let i = 0; i < favlist.length; i++) { if (favlist[i][0] == postID) { cont = true; break; } }
	if (cont) {
		let div = document.createElement("div");
		div.id = "isinfav2";
		div.title = "Post is in Super Favorites."
		div.innerHTML = "💚";
		navbar.appendChild(div);
	}
}

function updateNavbar(postID) {
	if (!isPage_post || !showFavPosts) { return; }
	updateNavbar_p1(postID);
	updateNavbar_p2(postID);
}

// add post to favorites, like it & add it to favlist
function favPost(id, close = false, element = null) {
	post_vote(id, 'up'); // like
	addFav(id); // add to fav

	// wait for server to respond
	var timer = setInterval(function() {
		var selectElement = document.getElementById("notice");
		if (selectElement.innerHTML.includes("You are not logged in")) { clearInterval(timer); return; }
    
		if (!selectElement.innerHTML.includes("Post added to favorites") && !selectElement.innerHTML.includes("Post already in your favorites")) {
			document.title = id + ": ...";
			selectElement.innerHTML = "Error, trying again..."
			return;
		}

		if      (selectElement.innerHTML.includes("Post added to favorites"))        { document.title = id + ": +"; }
		else if (selectElement.innerHTML.includes("Post already in your favorites")) { document.title = id + ": !"; }
		else                                                                         { document.title = id + ": ?"; }

		clearInterval(timer);

		// add to favlist
		if (showFavPosts) {
			let favlist = GM_getValue("favlist", []);
			if (favlist.includes(id)) {
				selectElement.innerHTML += ", Post already in your favlist";
				document.title += "!";
			} else {
				favlist.push(id);
				GM_setValue("favlist", favlist);
				selectElement.innerHTML += ", Added to favlist";
				document.title += "+";
			}

			// if element is passed
			showFavPosts_check(element);

			// if on posts page update navbar
			updateNavbar(id);
		}

		if (close) { window.close(); }
	}, 100);
}

function favPost2(postID) {
	let favlist = GM_getValue("favlist2", []);
	for (let i = 0; i < favlist.length; i++) { if (favlist[i][0] == postID) { return; } }

	let link = "";
	let as = document.getElementsByTagName("a");
	for (let i = 0; i < as.length; i++) {
		if (as[i].href && as[i].href.includes("saucenao.com")) {
			link = as[i].href.split("&url=")[1];
		}
	}
	if (link != "") {
		favlist.push([postID, link]);
		GM_setValue("favlist2", favlist);
		updateNavbar(postID);
	}
}

// get page html
function httpGet(url, callback, async) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, async);
	xhr.onload = function(e) {
		if (xhr.readyState === 4) {
			// xhr.status === 200
			callback(xhr.responseText);
		}
	};
	xhr.onerror = function(e) { console.error(xhr.statusText); };
	xhr.send(null);
}

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
var originalTitle = document.title;

var isPage_post = document.location.href.includes("index.php?page=post&s=view");
var isPage_posts = document.location.href.includes("index.php?page=post&s=list");
var isPage_fav = document.location.href.includes("index.php?page=favorites&s=view");
var isPage_opt = document.location.href.includes("index.php?page=account&s=options");
var isPage_main = (document.location.href == "http://rule34.xxx/" || document.location.href == "https://rule34.xxx/");

// get thumbnail post id
function getPostID(element) {
	let id = element.id.replace('s', '');
	if (id != "") { return id; }
	return element.childNodes[0].id.replace('p', '');
}

// add extra code to remove the id from favlist, when you press the remove button on the favorites page
function showFavPosts_injectRemoveCode(element) {

	if (!isPage_fav) { return;}

	let rm = element.childNodes[2];
	if (rm == undefined || rm == null) { return; }
	rm.remove();

	let id = element.childNodes[0].id.replace('p', '');

	let btn = document.createElement("button");
	btn.className = "button-remove";
	btn.title = "remove: " + id;
	btn.innerHTML = "❌REMOVE❌";
	btn.onclick = function() {
		let favlist = GM_getValue("favlist", []);
		GM_setValue("favlist", favlist.filter(e => e !== id));
		document.location = 'index.php?page=favorites&s=delete&id=' + id;
	};
	element.appendChild(btn);
}

// if blacklisted remove
function hideBlacklistedThumbnails_check(element) {
	if (element == null || element.className != "thumb blacklisted-image") { return; }
	element.remove();
}

// add fav button on post
function thumbFav_check(element) {

	if (element == null || element.className == "thumb fav" || element.classname == "thumb 4fav" ) { return; }

	element.className = "thumb 4fav";
	element.style.position = "relative";

	let tag = document.createElement('button');
	tag.innerHTML = "♥";
	tag.title = "Add to favorites";
	tag.style.position = "absolute";
	tag.style.top = "20%";
	tag.style.left = "80%";
	tag.style.width = "20%";
	tag.style.height = "20%";
	tag.style.color = "#ffffff";
	tag.style.textAlign = "#center";
	tag.style.font = "normal bold 19px arial,serif";
	tag.style.border = "solid 3px red";
	tag.style.backgroundColor = "rgba(20, 20, 20, .8)";
	tag.style.transform = "translate(-50%, -50%)";
	tag.style.display = "none";

	element.appendChild(tag);

	tag.onmousedown = function() { tag.remove(); favPost(getPostID(element), false, element); };

	element.onmouseenter = function() { tag.style.display = "block"; };
	element.onmouseleave = function() { tag.style.display = "none"; };
}

function embedDefaultVideo() {
	let playerCont = document.getElementById("gelcomVideoContainer");
	if (!playerCont) { return; }

	// set style of video as the container
	let vid = document.createElement("video");
	vid.id = "gelcomVideoContainer";
	vid.controls = true;
	vid.volume = defaultVideoVolume;
	vid.style.cssText = playerCont.style.cssText;

	// get player src
	let player = document.getElementById("gelcomVideoPlayer");
	// let link = document.getElementById('stats').nextElementSibling.childNodes[3].childNodes[3].childNodes[0];
	vid.src = player.currentSrc;
	playerCont.style.display = "none";
	playerCont.parentNode.insertBefore(vid, playerCont);
	//playerCont.parentNode.replaceChild(vid, playerCont);
}

if (hideBlacklistedThumbnails) {
	let elements = document.getElementsByClassName("thumb blacklisted-image");
	while (elements[0]) { elements[0].remove(); }
}

if (thumbFav) {
	let elements = document.getElementsByClassName("thumb");
	for (let i = 0; i < elements.length; i++) { thumbFav_check(elements[i]); }
}

// remove clicker ad and other ads
if (removeBloat) {
	let items = document.getElementsByTagName("a");
	for (i = items.length - 1; i >= 0; i--) {
		//if (items[i].href.includes("clicker")) { items[i].remove(); }
		if (items[i].href.includes("https://rule34.xxx/hwspecial.php")) { items[i].remove(); }
		if (items[i].href.includes("https://buymyshit.moneygrubbingwhore.com")) { items[i].remove(); }
		// will add more if rule34 adds more
	}
}

if (forceDarkTheme) {
	document.cookie = "theme=dark; Path=/;"
	//Cookie.create('theme', 'dark');

	// disable default css
	document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) {
		if (node.href.includes("desktop.css")) { node.disabled = true; }
		if (node.href.includes("h2-mobile.css")) { node.disabled = true; }
	});

	// append dark theme
	let head = document.getElementsByTagName('head')[0];
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://rule34.xxx/css/desktop_bip.css?7';
	link.media = 'screen';
	head.appendChild(link);

	// append even better dark theme css
	if (betterDarkTheme) { GM_addStyle(betterDarkThemeCss) }
}

// options page
if (isPage_opt) {
	let vtbody = document.body.getElementsByTagName("tbody")[0];

	function makeCB(setv_, setv) {
		let label = document.createElement("label");
		label.className = "checkboxContainer";
		let input = document.createElement("input");
		input.type = "checkbox";
		input.checked = GM_getValue(setv_, setv);
		input.addEventListener("change", function() { GM_setValue(setv_, this.checked); setv = this.checked; });
		let span = document.createElement("span");
		span.className = "checkmark";
		label.appendChild(input);
		label.appendChild(span);
		return label;
	}

	function makeCB_form(setv_, setv, name, desc) {
		let vtr = document.createElement("tr");
		let vth = document.createElement("th");
		vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = name;
		vth.appendChild(vlabel);
		let vp = document.createElement("p");
		vp.innerHTML = desc;
		vth.appendChild(vp);
		vtr.appendChild(vth);
		let vtd = document.createElement("td");
		vtd.appendChild(makeCB(setv_, setv));
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}

	makeCB_form(autoplayVideos_, autoplayVideos, "AutoPlay", "Automatically play the video");
	{
		let row = document.createElement("tr");
		let header = document.createElement("th");
		let title = document.createElement("label");
		title.className = "block";
		title.innerHTML = "Default Video Volume";
		header.appendChild(title);
		row.appendChild(header);

		let data = document.createElement("td");
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.value = GM_getValue(defaultVideoVolume_, defaultVideoVolume) * 100;
		slider.className = "slider";
		let slider_info = document.createElement("p");
		slider_info.style = "display: inline-block;";
		slider_info.innerHTML = "Volume: " + slider.value + "%";
		slider.oninput = function() {
			slider_info.innerHTML = "Volume: " + slider.value + "%";
			GM_setValue(defaultVideoVolume_, slider.value / 100);
		}
		data.appendChild(slider);
		data.appendChild(slider_info);
		row.appendChild(data);
		vtbody.appendChild(row);
	}
	{
		let row = document.createElement("tr");
		let header = document.createElement("th");
		let title = document.createElement("label");
		title.className = "block";
		title.innerHTML = "Image/Video Height";
		let p = document.createElement("p");
		p.innerHTML = "Viewport Dependent Height";
		header.appendChild(title);
		header.appendChild(p);
		row.appendChild(header);

		let data = document.createElement("td");
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = 0;
		slider.max = 100;
		slider.value = GM_getValue(viewportDependentHeight_, viewportDependentHeight);
		slider.className = "slider";
		let slider_info = document.createElement("p");
		slider_info.style = "display: inline-block;";
		slider_info.innerHTML = slider.value + "%";
		slider.oninput = function() {
			slider_info.innerHTML = slider.value + "%";
			GM_setValue(viewportDependentHeight_, slider.value);
		}

		data.appendChild(makeCB(useViewportDependentSize_, useViewportDependentSize));
		data.appendChild(slider);
		data.appendChild(slider_info);
		row.appendChild(data);
		vtbody.appendChild(row);
	}
	makeCB_form(stretchImgVid_,             stretchImgVid,             "Stretch Image/Video", "This overrides 'True Video Size'");
	makeCB_form(trueVideoSize_,             trueVideoSize,             "True Video Size", "Resizes videos to their true size");
	makeCB_form(enableFavOnEnter_,          enableFavOnEnter,          "Enable Fav On Enter", "Use the ENTER key on your keyboard to add a post to your favorites");
	makeCB_form(hideBlacklistedThumbnails_, hideBlacklistedThumbnails, "Hide Blacklisted Thumbnails", "Hide blacklisted thumbnails on the main post page");
	makeCB_form(forceDarkTheme_,            forceDarkTheme,            "Force Dark Theme", "Force rule34's dark theme on every page");
	makeCB_form(betterDarkTheme_,           betterDarkTheme,           "Better Dark Theme", "(must enable 'Force Dark Theme') Use a custom CSS dark theme with the rule34's dark theme");
	makeCB_form(removeBloat_,               removeBloat,               "Remove Bloat", "Removes: hentai clicker game AD, and other bullshit.");
	makeCB_form(endlessScrolling_,          endlessScrolling,          "Endless Scrolling", "When you get to the bottom of the current page it will automatically append the content from the next page on the current page");
	makeCB_form(favFilter_,                 favFilter,                 "Favorites Filter", "Adds a searchbox for tag(s) in favorites");
	makeCB_form(showFavPosts_,              showFavPosts,              "Show Fav Posts", "Shows you which posts are in your favorites while browsing");
	makeCB_form(showFavPosts2_,             showFavPosts2,             "Hide Fav Posts", "(must enable 'Show Fav Posts') Hides favorites while browsing");
	makeCB_form(embedVideo_,                embedVideo,                "Embed Video", "Replace rule34's player with the default browser player");
	makeCB_form(thumbFav_,                  thumbFav,                  "Thumb Fav", "Adds a fav button on each post while browsing");
	makeCB_form(mainPageExtra_,             mainPageExtra,             "Main Page Extra", "Adds a button (on the main page) that expands to a form that allows you to bookmark tags and see super favorites");
}

// favorites page
if (isPage_fav) {

	//// remove stupid <br>s on fav page wtf... why are they here
	//let bodyc = document.getElementById("body").children;
	//for (let i = 0; i < bodyc.length; i++) { if (bodyc[i].tagName === "BR") { bodyc[i].remove(); } }

	// container for all the controls in favorites
	let cont = document.createElement("div");
	cont.id = "favcontrols";
	cont.style = "margin: 2px 5px 10px 5px;"
	document.getElementById("header").parentNode.insertBefore(cont, document.getElementById("header").nextSibling);

	if (favFilter) {
		function removeContent() {
			let elements = document.getElementsByClassName("thumb");
			while (elements[0]) { elements[0].remove(); }
		}

		let imagesAdded = 0;
		let shouldStop = false;

		// start search
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let reg = /pid=([0-9]*)/gm;

		let paginator = document.getElementById("paginator");

		let cont = document.getElementById("favcontrols");

		// textbox for tags
		let input = document.createElement("input");
		input.style = "width: 20%; display: inline-block;";
		input.type = "text";
		input.addEventListener("keydown", function(event) { if (event.key === 'Enter') { event.preventDefault(); main_favFilter(); } });

		// filter/search button
		let btn_filter = document.createElement("button");
		btn_filter.style = "display: inline-block;";
		btn_filter.id = "filterButton";
		btn_filter.title = "Start search"
		btn_filter.innerHTML = "Filter";
		btn_filter.onclick = function() { main_favFilter(); }

		// stop button
		let btn_stop = document.createElement("button");
		btn_stop.style = "display: inline-block;";
		btn_stop.title = "Stop search";
		btn_stop.innerHTML = "Stop";
		btn_stop.onclick = function() { shouldStop = true; }

		// help button
		let btn_help = document.createElement("button");
		btn_help.style = "display: inline-block;";
		btn_help.title = "Show help";
		btn_help.innerHTML = "Help";
		btn_help.onclick = function() {
			alert(
				"The slider sets the time between requests.\n" +
				"This is not an officially supported service.\n" +
				"If you make too many requests, you might get temporarily blocked.\n" +
				"The recommended time slider delay is 1000ms\n" +
				"If the search takes too long try decreasing the time between requests."
			);
		}

		// slider
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "100";
		slider.max = "4000";
		slider.value = 1000;
		slider.className = "slider";
		slider.id = "delayRange";

		// slider speed label
		let txt_speed = document.createElement("p");
		txt_speed.style = "display: inline-block;";
		txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
		slider.oninput = function() { txt_speed.innerHTML = "Request Speed: " + slider.value + "ms"; }

		// current / max
		let txt_curmax = document.createElement("p");
		txt_curmax.id = "curmax";
		txt_curmax.style = "margin: 0;";

		// url - status
		let txt_status = document.createElement("p");
		txt_status.id = "status";
		txt_status.style = "margin: 0;";

		// loaded images count
		let txt_imageCount = document.createElement("p");
		txt_imageCount.id = "imageCount"
		txt_imageCount.style = "margin: 0;";

		// clear images button
		let btn_clear = document.createElement("button");
		btn_clear.style = "display: inline-block;";
		btn_clear.title = "Hide all content";
		btn_clear.innerHTML = "Clear";
		btn_clear.onclick = function() {
			removeContent();
			imagesAdded = 0;
			document.title = originalTitle;
			txt_curmax.innerHTML = "";
			txt_status.innerHTML = "";
			txt_imageCount.innerHTML = "";
		}

		cont.appendChild(input);
		cont.appendChild(btn_filter);
		cont.appendChild(btn_stop);
		cont.appendChild(btn_clear);
		cont.appendChild(btn_help);
		cont.appendChild(slider);
		cont.appendChild(txt_speed);
		cont.appendChild(txt_curmax);
		cont.appendChild(txt_status);
		cont.appendChild(txt_imageCount);

		async function main_favFilter() {
			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

			// call clear
			btn_clear.click();

			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				txt_curmax.innerHTML = url + " -- " + cur + "/" + max + " (" + ((cur / step) + 1) + "/" + ((max / step) + 1) + ")";
				let match = input.value.split(" ");
				
				httpGet(url, function(response) {

					document.title = "[" + imagesAdded + "] Loading...";
					txt_status.innerHTML = "Loading...";

					let doc = new DOMParser().parseFromString(response, "text/html");
					let images = Array.prototype.slice.call(doc.getElementsByTagName("img"), 0);

					let pag = document.getElementById("paginator");
					for (let i = images.length - 1; i >= 0; i--) {
						let addImage = true;
						for (let j = 0; j < match.length; j++) { if (!images[i].title.includes(match[j])) { addImage = false; break; } }
						if (addImage) { pag.parentNode.insertBefore(images[i].parentNode.parentNode, pag); imagesAdded++; }
					}
					document.title = "[" + imagesAdded + "] Done!";
					txt_imageCount.innerHTML = "Images Loaded: " + imagesAdded;
					txt_status.innerHTML = "Done!";
				});

				await sleep(slider.value);
				if (shouldStop) { shouldStop = false; return; }
			}
		};
	}
}

if (showFavPosts) {

	if (showFavPosts2) { document.documentElement.style.setProperty('--favdisplay', 'none'); }

	// filtering
	if (isPage_posts) {
		let elements = document.querySelectorAll(".thumb");
		for (let i = 0; i < elements.length; i++) { showFavPosts_check(elements[i]); }
	}

	if (isPage_fav) {

		// show fav posts
		let elements = document.querySelectorAll(".thumb");
		for (let i = 0; i < elements.length; i++) {
			showFavPosts_check(elements[i]);
			showFavPosts_injectRemoveCode(elements[i]);
		}

		// stuff to update list
		// status
		let status = document.createElement("div");
		status.id = "favlistStatus";
		status.style = "display: block;";
		status.title = "processed\nfavlist count\nadded";
		// update button
		let btn_updatefav = document.createElement("button");
		btn_updatefav.style = "display: block;";
		btn_updatefav.title = "Updates favorites list (" + GM_getValue("favlist", []).length + " ID(s))";
		btn_updatefav.innerHTML = "Update";
		async function getIds() {
			let reg = /pid=([0-9]*)/gm;
			let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
			if (!base.includes("favorites")) { return console.log("not a favorites page"); };

			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

			let c = 0;
			let added = 0;

			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				let favlist = GM_getValue("favlist", []);
				httpGet(url, function(response) {
					let doc = new DOMParser().parseFromString(response, "text/html");
					let elements = doc.getElementsByClassName("thumb");
					for (let i = 0; i < elements.length; i++) {
						let id = elements[i].childNodes[0].id.replace('p', '');
						if (!favlist.includes(id)) {
							favlist.push(id);
							added++;
						}
						c++;
						status.innerHTML = c + "<br>" + favlist.length + "<br>" + added;
					}
				}, false);
				GM_setValue("favlist", favlist);
			}
		}
		btn_updatefav.onclick = function() { getIds(); };
		// container for controls
		let favlistCont = document.createElement("div");
		favlistCont.style = "position: fixed; top: 30px; right: 5px;";
		favlistCont.appendChild(btn_updatefav);
		favlistCont.appendChild(status);
		document.body.appendChild(favlistCont);
	}
}

// endless scrolling
if (isPage_posts || isPage_fav) {

	let div = document.createElement("div");
	div.id = "trcont";
	div.style = "position: fixed; top: 5px; right: 5px;";

	let label = document.createElement("label");
	label.className = "checkboxContainer";
	label.title = "Enable endless scrolling";
	label.id = "trcheckbox";
	let input = document.createElement("input");
	input.type = "checkbox";
	input.checked = endlessScrolling;
	input.addEventListener("change", function() { GM_setValue(endlessScrolling_, this.checked); endlessScrolling = this.checked; });
	let span = document.createElement("span");
	span.className = "checkmark";
	label.appendChild(input);
	label.appendChild(span);
	div.append(label);

	if (showFavPosts) {
		let label2 = document.createElement("label");
		label2.className = "checkboxContainer";
		label2.title = "Hide favorites";
		label2.id = "trcheckbox";
		let input2 = document.createElement("input");
		input2.type = "checkbox";
		input2.checked = showFavPosts2;
		input2.addEventListener("change", function() {
			GM_setValue(showFavPosts2_, this.checked);
			showFavPosts2 = this.checked;
			document.documentElement.style.setProperty('--favdisplay', (input2.checked ? "none" : "inline"));
		});
		let span2 = document.createElement("span");
		span2.className = "checkmark";
		label2.appendChild(input2);
		label2.appendChild(span2);
		div.append(label2);
	}


	let p = document.createElement("p");
	p.id = "endlessScrolling_p";
	p.style = "display: block; float: left;";
	p.innerHTML = "";
	div.append(p);

	document.body.appendChild(div);

	function isInViewport(myElement) {
		var bounding = myElement.getBoundingClientRect();
		return (bounding.top >= 0 && bounding.left >= 0 && bounding.right <= (window.innerWidth || document.documentElement.clientWidth) && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight));
	}

	let reachedTheEnd = false;
	async function main_scroll() {
		let reg = /pid=([0-9]*)/gm;
		let add = document.location.href;
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let step = base.includes("favorites") ? 50 : 42;
		let el;
		let text;
		switch (step) {
			case 42: {
				el = document.getElementsByTagName("a")[document.getElementsByTagName("a").length - 2];
				text = el.href;
				break;
			}
			case 50: {
				let els = document.getElementsByName("lastpage");
				if (els.length == 0) { return; }
				el = els[0];
				text = el.attributes[1].nodeValue;
				break;
			}
			default: return;
		}
		let maxMatch = reg.exec(text);
		let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
		let curMatch = /pid=([0-9]*)/gm.exec(add);
		let cur = curMatch == null ? 0 : parseInt(curMatch[1]);
		let paginator = document.getElementById("paginator");

		window.addEventListener("scroll", async function() {
			if (reachedTheEnd || !endlessScrolling || !isInViewport(paginator)) { return; }
			if (!endlessScrolling) { return; }
			cur += step;
			let url = base + "&pid=" + cur;
			document.title = "Loading...";
			httpGet(url, function(response) {
				document.title = originalTitle;
				let doc = new DOMParser().parseFromString(response, "text/html");
				//let elements = doc.getElementsByClassName("thumb");
				let elements = Array.prototype.slice.call(doc.getElementsByClassName("thumb"), 0);
				if (elements.length == 0) { reachedTheEnd = true; return; }
				for (let i = 0; i < elements.length; i++) {
					paginator.parentNode.insertBefore(elements[i], paginator);
					if (hideBlacklistedThumbnails) { hideBlacklistedThumbnails_check(elements[i]); }
					if (showFavPosts) { showFavPosts_check(elements[i]); showFavPosts_injectRemoveCode(elements[i]); }
					if (thumbFav) { thumbFav_check(elements[i]); }
				}
				p.innerHTML = cur + " (" + ((cur + step) / step) + ")";
			}, false);
		});
	};

	main_scroll();
}

// post view (default vol, size the image/vid, add buttons)
if (isPage_post) {

	// set vars
	let postID = document.location.href.split("id=")[1];

	if (enableFavOnEnter) {
		document.onkeydown = function(e) {
			var event = document.all ? window.event : e;
			switch (e.target.tagName.toLowerCase()) {
				case "input":
				case "textarea":
				case "select":
				case "button":
				case "tags":
				case "comment": break;
				default: if (event.key === 'Enter') { favPost(postID); } break;
			}
		}
	}

	// add custom css
	GM_addStyle(postCss);

	// video settings
	let vid = document.querySelector("#gelcomVideoPlayer");
	if (vid) {
		vid.volume = defaultVideoVolume;
		if (autoplayVideos) { vid.autoplay = true; }
		if (!stretchImgVid && trueVideoSize) {
			let size = document.querySelector("#stats > ul:nth-child(2) > li:nth-child(3)").innerHTML.split(": ")[1];
			let wNh = size.split("x");
			let w = wNh[0];
			let h = wNh[1];
			vid.style = "width: " + w + "px; max-width: 100%; height: " + h + "px;";
		}
	}

	// buttons and stuff
	let navbar = document.getElementById("subnavbar");
	let cont = document.createElement("div");
	cont.id = "postbar";

	let btn_like = document.createElement("button");
	btn_like.className = "custom-button";
	btn_like.innerHTML = "👍like";
	btn_like.onclick = function() { post_vote(postID, 'up'); };
	cont.appendChild(btn_like);

	let btn_fav = document.createElement("button");
	btn_fav.className = "custom-button";
	btn_fav.innerHTML = "❤️fav";
	btn_fav.onclick = function() { favPost(postID); };
	cont.appendChild(btn_fav);

	let btn_close = document.createElement("button");
	btn_close.className = "custom-button";
	btn_close.innerHTML = "❌close";
	btn_close.onclick = function() { window.close(); };
	cont.appendChild(btn_close);

	let btn_favclose = document.createElement("button");
	btn_favclose.className = "custom-button";
	btn_favclose.innerHTML = "❤️+❌favclose";
	btn_favclose.onclick = function() { favPost(postID, true); };
	cont.appendChild(btn_favclose);

	let btn_prev = document.createElement("button");
	btn_prev.className = "custom-button";
	btn_prev.innerHTML = "⏮️prev";
	btn_prev.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").click(); };
	cont.appendChild(btn_prev);

	let btn_next = document.createElement("button");
	btn_next.className = "custom-button";
	btn_next.innerHTML = "⏭️next";
	btn_next.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)").click(); };
	cont.appendChild(btn_next);

	let btn_fav2 = document.createElement("button");
	btn_fav2.className = "custom-button";
	btn_fav2.innerHTML = "💚superfav";
	btn_fav2.onclick = function() { favPost2(postID); };
	cont.appendChild(btn_fav2);

	navbar.appendChild(cont);

	// show if a post is in fav
	updateNavbar(postID);

	if (embedVideo) { embedDefaultVideo(); }
}

if (isPage_main && mainPageExtra) {

	function loadExtraContent() {
		let favTagsDiv = document.createElement("div");
		favTagsDiv.className = "tagbar";
		favTagsDiv.style = "position: fixed; top: 5px; right: 5px; border: lime 1px dashed; padding: 4px; width: 180px;"

		let favTagsDiv_h5 = document.createElement("h5");
		favTagsDiv_h5.innerHTML = "Favorite Tags";
		favTagsDiv.appendChild(favTagsDiv_h5);

		function favTagsDiv_add(text) {
			let div = document.createElement("div");
			div.className = "favtag";

			let a = document.createElement("a");

			let rm = document.createElement("button");
			rm.innerHTML = "-"
			rm.title = "Remove";
			rm.onclick = function() {
				let taglist = GM_getValue("taglist", []);
				GM_setValue("taglist", taglist.filter(e => e !== text));
				div.remove();
			}

			a.innerHTML = text;
			a.href = "index.php?page=post&s=list&tags=" + text;
			div.appendChild(rm);
			div.appendChild(a);
			favTagsDiv.appendChild(div);
		}

		let input = document.createElement("input");
		input.style = "width: 93%; display: inline-block;";
		input.type = "text";

		function add() {
			if (!input.value) { return; }
			let taglist = GM_getValue("taglist", []);
			if (!taglist.includes(input.value)) {
				taglist.push(input.value);
				GM_setValue("taglist", taglist);
				favTagsDiv_add(input.value);
				input.value = "";
			}
		}

		function sortItems() {
			let elements = document.getElementsByClassName("favtag");
			while (elements[0]) { elements[0].remove(); }
			let tl = GM_getValue("taglist", []);
			tl.sort();
			for (let i = 0; i < tl.length; i++) { favTagsDiv_add(tl[i]); }
			GM_setValue("taglist", tl);
		}

		input.addEventListener("keydown", function(event) { if (event.key === 'Enter' ) { add(); } });

		let btn_add = document.createElement("button");
		btn_add.style = "padding: 1px; color: lime; cursor: pointer;"
		btn_add.innerHTML = "🔽";
		btn_add.onclick = function() { add(); };
		btn_add.title = "Add";

		let btn_sort = document.createElement("button");
		btn_sort.style = "padding: 1px; color: lime; cursor: pointer;"
		btn_sort.innerHTML = "🧮";
		btn_sort.onclick = function() { sortItems(); };
		btn_sort.title = "Sort";

		favTagsDiv.appendChild(input);
		favTagsDiv.appendChild(btn_add);
		favTagsDiv.appendChild(btn_sort);

		// add fav tags
		let tl = GM_getValue("taglist", []);
		for (let i = 0; i < tl.length; i++) { favTagsDiv_add(tl[i]); }

		let superFavDiv = document.createElement("div");
		superFavDiv.className = "superFavCont";
		superFavDiv.style = "height: auto; margin-bottom: 500px;";

		let superFavDiv_h5 = document.createElement("h5");
		superFavDiv_h5.style = "margin-left: 10px; text-decoration: underline;"
		superFavDiv_h5.innerHTML = "Super Favorites";
		superFavDiv.appendChild(superFavDiv_h5);

		let favlist = GM_getValue("favlist2", []);
		for (let i = 0; i < favlist.length; i++) {
			let id = favlist[i][0];
			let thumbURL = favlist[i][1];

			let span = document.createElement("span");
			span.id = "s" + id;
			span.style = "border: none; position: relative; padding-left: 10px; padding-right: 2px;";
			span.className = "thumb sfav";

			let a = document.createElement("a");
			a.style.border = "none";
			a.id = "p" + id;
			a.href = "index.php?page=post&s=view&id=" + id;

			let img = document.createElement("img");
			img.className = "preview";
			img.style.border = "none";
			img.alt = id;
			img.src = thumbURL;
			a.appendChild(img);

			let btn_rm = document.createElement("Remove");
			btn_rm.innerHTML = "❌REMOVE❌";
			btn_rm.title = "Remove from Super Favorites"
			btn_rm.style = "cursor: pointer;"
			btn_rm.onclick = function() {
				favlist.splice(i, 1);
				GM_setValue("favlist2", favlist);
				span.remove();
			}

			span.appendChild(a);
			span.appendChild(btn_rm);

			superFavDiv.appendChild(span);
		}
		
		document.body.appendChild(favTagsDiv);
		document.body.appendChild(superFavDiv);
	}

	let btn_expand = document.createElement("btn_expand");
	btn_expand.id = "expand-button";
	btn_expand.innerHTML = "🔽";
	btn_expand.title = "Expand";
	btn_expand.style = expandButtonStyle;
	btn_expand.onclick = function() {
		loadExtraContent();
		btn_expand.remove();
	}
	document.body.appendChild(btn_expand);
}

