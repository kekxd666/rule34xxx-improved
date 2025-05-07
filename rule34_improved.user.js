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

// TODO:
// - this whole code needs to be refactored it's ugly (code order, inconsistent naming, need to SOC every func - rm repeating code)... makes it really unmaintainable xd lmao
// - add video support for "super favorites"
// - make slideshow work in favorites
// - make slideshow prefetch a few posts after content so it's not slow

// #region SETTINGS

function getSetting(settingName, settingDefault) {
    let value = GM_getValue(settingName, null);
    if (value == null) { GM_setValue(settingName, settingDefault); value = settingDefault; }
    return value;
}

var setting_autoplayVideos_            = "autoplayVideos";            var setting_autoplayVideos             = getSetting(setting_autoplayVideos_,            true);
var setting_defaultVideoVolume_        = "defaultVideoVolume";        var setting_defaultVideoVolume         = getSetting(setting_defaultVideoVolume_,        1);
var setting_useViewportDependentSize_  = "useViewportDependentSize";  var setting_useViewportDependentSize   = getSetting(setting_useViewportDependentSize_,  true);
var setting_viewportDependentHeight_   = "viewportDependentHeight";   var setting_viewportDependentHeight    = getSetting(setting_viewportDependentHeight_,   70);
var setting_stretchImgVid_             = "stretchImgVid";             var setting_stretchImgVid              = getSetting(setting_stretchImgVid_,             true);
var setting_trueVideoSize_             = "trueVideoSize";             var setting_trueVideoSize              = getSetting(setting_trueVideoSize_,             false);
var setting_enableFavOnEnter_          = "enableFavOnEnter";          var setting_enableFavOnEnter           = getSetting(setting_enableFavOnEnter_,          true);
var setting_hideBlacklistedThumbnails_ = "hideBlacklistedThumbnails"; var setting_hideBlacklistedThumbnails  = getSetting(setting_hideBlacklistedThumbnails_, true);
var setting_forceDarkTheme_            = "forceDarkTheme";            var setting_forceDarkTheme             = getSetting(setting_forceDarkTheme_,            true);
var setting_betterDarkTheme_           = "betterDarkTheme";           var setting_betterDarkTheme            = getSetting(setting_betterDarkTheme_,           true);
var setting_removeBloat_               = "removeBloat";               var setting_removeBloat                = getSetting(setting_removeBloat_,               true);
var setting_endlessScrolling_          = "endlessScrolling";          var setting_endlessScrolling           = getSetting(setting_endlessScrolling_,          true);
var setting_favFilter_                 = "favFilter";                 var setting_favFilter                  = getSetting(setting_favFilter_,                 true);
var setting_showFavPosts_              = "showFavPosts";              var setting_showFavPosts               = getSetting(setting_showFavPosts_,              true);
var setting_showFavPosts2_             = "showFavPosts2";             var setting_showFavPosts2              = getSetting(setting_showFavPosts2_,             false);
var setting_embedVideo_                = "embedVideo";                var setting_embedVideo                 = getSetting(setting_embedVideo_,                true);
var setting_thumbFav_                  = "thumbFav";                  var setting_thumbFav                   = getSetting(setting_thumbFav_,                  true);
var setting_mainPageExtra_             = "mainPageExtra";             var setting_mainPageExtra              = getSetting(setting_mainPageExtra_,             true);
var setting_mainPageExtraAutoExpand_   = "mainPageExtraAutoExpand";   var setting_mainPageExtraAutoExpand    = getSetting(setting_mainPageExtraAutoExpand_,   true);
var setting_slideShow_                 = "slideShow";                 var setting_slideShow                  = getSetting(setting_slideShow_,                 true);
var setting_videoVolumeScroll_         = "videoVolumeScroll";         var setting_videoVolumeScroll          = getSetting(setting_videoVolumeScroll_,         true);
var setting_loopVideo_                 = "loopVideo";                 var setting_loopVideo                  = getSetting(setting_loopVideo_,                 false);
var setting_taglistquick_              = "taglistquick";              var setting_taglistquick               = getSetting(setting_taglistquick_,              ["sort:score", "animated"]);

// #endregion

// #region CSS STYLES

var css_root = `
:root { --favdisplay: inline; }

.fav {
    opacity: 0.4;
    box-sizing: border-box;
    background-clip: padding-box;
    padding: 5px;
    background: rgba(121, 28, 106, 0.5);
    border: 3px dashed hotpink;
}

.sfav {
    opacity: 0.4;
    box-sizing: border-box;
    background-clip: padding-box;
    padding: 5px;
    background: rgba(28, 121, 47, 0.5);
    border: 3px dashed lime;
}

.fav.sfav {
    opacity: 0.4;
    background-clip: padding-box;
    background: linear-gradient(to bottom, green, purple) !important;
    border-top: 3px dashed lime;
    border-left: 3px dashed lime;
    border-right: 3px dashed hotpink;
    border-bottom: 3px dashed hotpink;
}

.thumbFav {
    position: absolute;
    top: 20%;
    left: 80%;
    width: 20%;
    height: 20%;
    color: hotpink;
    text-align: center;
    font: bold 19px arial, serif;
    border: 3px solid hotpink;
    background-color: rgba(20, 20, 20, 0.8);
    transform: translate(-50%, -50%);
    display: none;
    border-radius: 50%;
}

.r34imp_button {
    padding: 1px;
    color: lime;
    background-color: #7fff0020;
    cursor: pointer;
    border-color: green;
    margin: 3px;
}

.r34imp_slideshow_current {
    border: 5px dotted red !important;
    box-sizing: border-box;
}

`;
GM_addStyle(css_root);

var css_betterDarkTheme = `
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

.r34imp_slider {
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

.r34imp_slider:hover { opacity: 1; }

.r34imp_slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
}

.r34imp_slider::-moz-range-thumb {
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

var css_post = `
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

` + (setting_useViewportDependentSize ?
        ((setting_stretchImgVid ? `
#gelcomVideoContainer {
    width: auto !important;
    max-width: 100% !important;
    height: ` + setting_viewportDependentHeight + `vh !important;
}` : "") + `
#image {
    width: auto !important;
    max-width: 100% !important;
    ` + (setting_stretchImgVid ? "" : "max-") + `height: ` + setting_viewportDependentHeight + `vh !important;
}`) : "");

// #endregion

// #region UTILS / MISC

// get thumbnail post id
function getPostID(element) {
    let id = element.id.replace('s', '').replace('p', '');
    if (id != "") {
        return id;
    }
    const link = element.querySelector("a");
    return link.id.replace('p', '');
}

function GetThumb(id) {
    let contentURL = "";
    httpGet("index.php?page=post&s=view&id=" + id, function(response) {
        let doc = new DOMParser().parseFromString(response, "text/html");
        let as = doc.body.getElementsByTagName("a");
        for (let i = 0; i < as.length; i++) {
            if (as[i].getAttribute("href").includes("http://saucenao.com/search.php?")) {
                contentURL = as[i].getAttribute("href").split("&url=", 2)[1];
                break;
            }
        }
    }, false);

    return contentURL;

}

// get original image/video url from id
function GetOG(id) {
    // get/show content
    let contentURL = "";
    httpGet("index.php?page=post&s=view&id=" + id, function(response) {
        let doc = new DOMParser().parseFromString(response, "text/html");
        let metas = doc.body.getElementsByTagName("meta");
        for (let i = 0; i < metas.length; i++) {
            if (metas[i].getAttribute("property") == "og:image") {
                contentURL = metas[i].getAttribute("content");
                break;
            }
        }
    }, false);

    return contentURL;
}

function favlist_contains(id) {
    return GM_getValue("favlist", []).includes(id);
}

function favlist2_contains(postID) {
    if (!postID) {
        return false;
    }
    let favlist = GM_getValue("favlist2", []);
    for (let i = 0; i < favlist.length; i++) {
        if (favlist[i][0] == postID) {
            return true;
        }
    }
    return false;
}

function showFavPosts_elementUpdate(element, isfav, isfav2) {
    if (isfav && !element.classList.contains("fav")) {
        element.style.position = "relative";
        element.classList.add("fav");

        if (setting_thumbFav) {
            element.onmouseenter = null;
            element.onmouseleave = null;
        }
    }

    if (isfav2 && !element.classList.contains("sfav")) {
        element.classList.add("sfav");
    }


    if (isfav || isfav2) {
        element.style = "display: var(--favdisplay);"
    }
}

// add custom css to show that the post is in fav
function showFavPosts_elementCheck(element) {
    if (element == null) {
        return;
    }
    let id = getPostID(element);
    let isfav = favlist_contains(id);
    let isfav2 = favlist2_contains(id);
    showFavPosts_elementUpdate(element, isfav, isfav2);
}

// show red heart for fav
function updateSubnavbar_p1(postID) {
    let ul_subnavbar = document.getElementById("subnavbar");
    for (let i = 0; i < ul_subnavbar.childNodes.length; i++) {
        if (ul_subnavbar.childNodes[i].id == "isinfav") {
            return;
        }
    }
    if (!favlist_contains(postID)) {
        return;
    }

    let div_isinfav = document.createElement("div");
    div_isinfav.id = "isinfav";
    div_isinfav.title = "Post is in Favorites."
    div_isinfav.innerHTML = "❤️";
    ul_subnavbar.appendChild(div_isinfav);
}

// show green heart for super fav
function updateSubnavbar_p2(postID) {
    let ul_subnavbar = document.getElementById("subnavbar");
    for (let i = 0; i < ul_subnavbar.childNodes.length; i++) {
        if (ul_subnavbar.childNodes[i].id == "isinfav2") {
            return;
        }
    }
    if (!favlist2_contains(postID)) {
        return
    }

    let div_isinfav2 = document.createElement("div");
    div_isinfav2.id = "isinfav2";
    div_isinfav2.title = "Post is in Super Favorites."
    div_isinfav2.innerHTML = "💚";
    ul_subnavbar.appendChild(div_isinfav2);
}

function updateSubnavbar(postID) {
    if (!isPage_post || !setting_showFavPosts) {
        return;
    }
    updateSubnavbar_p1(postID);
    updateSubnavbar_p2(postID);
}

// add post to favorites, like it & add it to favlist
function favPost(id, callback) {
    post_vote(id, 'up'); // like
    addFav(id); // add to fav

    // wait for server to respond
    let timer = setInterval(function() {
        let div_notice = document.getElementById("notice");
        if (div_notice.innerHTML.includes("You are not logged in")) {
            clearInterval(timer);
            document.title = id + ": no login?";
            return;
        }

        if (!div_notice.innerHTML.includes("Post added to favorites") && !div_notice.innerHTML.includes("Post already in your favorites")) {
            document.title = id + ": ...";
            return;
        }

        if (div_notice.innerHTML.includes("Post added to favorites")) {
            document.title = id + ": +";
        } else if (div_notice.innerHTML.includes("Post already in your favorites")) {
            document.title = id + ": !";
        } else {
            document.title = id + ": ?";
        }

        clearInterval(timer);

        // add to favlist
        if (setting_showFavPosts) {
            let favlist = GM_getValue("favlist", []);
            if (favlist.includes(id)) {
                div_notice.innerHTML += ", Post already in your favlist";
                document.title += "!";
            } else {
                favlist.push(id);
                GM_setValue("favlist", favlist);
                div_notice.innerHTML += ", Added to favlist";
                document.title += "+";
            }

            callback();
        }
    }, 100);
}

function favPost2(postID) {

    if (favlist2_contains(postID)) {
        return;
    }

    let link = GetThumb(postID);

    if (link != "") {
        let favlist = GM_getValue("favlist2", []);
        favlist.push([postID, link]);
        GM_setValue("favlist2", favlist);
        updateSubnavbar(postID);
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
    xhr.onerror = function(e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
var originalTitle = document.title;

var isPage_post = document.location.href.includes("index.php?page=post&s=view");
var isPage_posts = document.location.href.includes("index.php?page=post&s=list");
var isPage_pool = document.location.href.includes("index.php?page=pool&s=show");
var isPage_fav = document.location.href.includes("index.php?page=favorites&s=view");
var isPage_opt = document.location.href.includes("index.php?page=account&s=options");
var isPage_main = (document.location.href == "http://rule34.xxx/" || document.location.href == "https://rule34.xxx/");

// add extra code to remove the id from favlist, when you press the remove button on the favorites page
function showFavPosts_injectRemoveCode(element) {

    if (!isPage_fav) {
        return;
    }

    const parent = element.parentElement;

    if (parent.querySelector(".button-remove") != null) {
        return;
    }

    const a_remove = parent.childNodes[5];
    if (a_remove == null) { return; }
    a_remove.remove();

    let id = getPostID(element);

    let button_remove = document.createElement("button");
    button_remove.className = "button-remove";
    button_remove.style = "padding-top: 15px;";
    button_remove.title = "remove: " + id;
    button_remove.innerHTML = "❌ Remove";
    button_remove.onclick = function() {
        let favlist = GM_getValue("favlist", []);
        GM_setValue("favlist", favlist.filter(e => e !== id));
        document.location = 'index.php?page=favorites&s=delete&id=' + id;
    };
    parent.appendChild(button_remove);
}

// if blacklisted remove
function hideBlacklistedThumbnails_check(element) {
    if (element == null || element.className != "thumb blacklisted-image") {
        return;
    }
    element.remove();
}

// add fav button on post
function thumbFav_check(element) {

    if (element == null || element.classList.contains("fav") || element.classList.contains("4fav")) {
        return;
    }

    element.classList.add("4fav");
    element.style.position = "relative";

    let button_favOnPost = document.createElement('button');
    button_favOnPost.innerHTML = "♥";
    button_favOnPost.className = "thumbFav";
    button_favOnPost.title = "Add to favorites";

    element.appendChild(button_favOnPost);

    button_favOnPost.onmousedown = function() {
        button_favOnPost.remove();
        let id = getPostID(element);
        favPost(id, function() {
            showFavPosts_elementCheck(element);
            updateNavbar(id);
        });
    }

    element.onmouseenter = function() {
        button_favOnPost.style.display = "block";
    };
    element.onmouseleave = function() {
        button_favOnPost.style.display = "none";
    };
}

function embedDefaultVideo() {
    let div_gelcomVideoContainer = document.getElementById("gelcomVideoContainer");
    if (!div_gelcomVideoContainer) {
        return;
    }

    // set style of video as the container
    let video_og = document.createElement("video");
    video_og.id = "videoEmbeded";
    video_og.controls = true;
    video_og.volume = setting_defaultVideoVolume;
    video_og.autoplay = setting_autoplayVideos;
    video_og.style.cssText = div_gelcomVideoContainer.style.cssText + (setting_trueVideoSize ? "" : (" max-height: " + setting_viewportDependentHeight + "vh"));
    video_og.addEventListener('volumechange', (event) => {
        GM_setValue(setting_defaultVideoVolume_, video_og.volume);
        setting_defaultVideoVolume = video_og.volume;
    });

    if (setting_loopVideo) {
        video_og.loop = true;
    }

    if (setting_videoVolumeScroll) {
        let current = 0;
        let MouseWheelHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();

            e = window.event || e;
            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            current = current + delta;

            let curVol = video_og.volume;
            if (delta == 1) {
                curVol += 0.05;
            } else if (delta == -1) {
                curVol -= 0.05;
            }

            if (curVol > 1) {
                video_og.volume = curVol = 1;
            } else if (curVol < 0) {
                video_og.volume = curVol = 0;
            } else {
                video_og.volume = curVol;
            }

            return false;
        };

        if (video_og.addEventListener) {
            // IE9, Chrome, Safari, Opera
            video_og.addEventListener("mousewheel", MouseWheelHandler, false);
            // Firefox
            video_og.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
        }
    }

    // get player src
    let video_gelcomVideoPlayer = document.getElementById("gelcomVideoPlayer");
    // let link = document.getElementById('stats').nextElementSibling.childNodes[3].childNodes[3].childNodes[0];
    video_og.src = video_gelcomVideoPlayer.currentSrc;
    div_gelcomVideoContainer.style.display = "none";
    div_gelcomVideoContainer.parentNode.insertBefore(video_og, div_gelcomVideoContainer);

    // //div_gelcomVideoContainer.remove(); // can't remove or will get a massive error spam in console
    //playerCont.parentNode.replaceChild(vid, playerCont);
}

if (setting_hideBlacklistedThumbnails) {
    let elements = document.getElementsByClassName("thumb blacklisted-image");
    while (elements[0]) {
        elements[0].remove();
    }
}

if (setting_thumbFav) {
    let elements = document.getElementsByClassName("thumb");
    for (let i = 0; i < elements.length; i++) {
        thumbFav_check(elements[i]);
    }
}

// remove clicker ad and other ads
if (setting_removeBloat) {
    let a_links = document.getElementsByTagName("a");
    for (i = a_links.length - 1; i >= 0; i--) {
        //if (items[i].href.includes("clicker")) { items[i].remove(); }
        if (a_links[i].href.includes("https://rule34.xxx/hwspecial.php")) {
            a_links[i].remove();
        }
        if (a_links[i].href.includes("https://buymyshit.moneygrubbingwhore.com")) {
            a_links[i].remove();
        }
        // will add more if rule34 adds more
    }
}

if (setting_forceDarkTheme) {
    document.cookie = "theme=dark; Path=/;"
    //Cookie.create('theme', 'dark');

    // disable default css
    document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) {
        if (node.href.includes("desktop.css")) {
            node.disabled = true;
        }
        if (node.href.includes("h2-mobile.css")) {
            node.disabled = true;
        }
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
    if (setting_betterDarkTheme) {
        GM_addStyle(css_betterDarkTheme)
    }
}
// #endregion

// #region OPTIONS PAGE
if (isPage_opt) {
    let tbody_options = document.body.getElementsByTagName("tbody")[0];

    function makeCB(setv_, setv) {
        let label = document.createElement("label");
        label.className = "checkboxContainer";
        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = GM_getValue(setv_, setv);
        input.addEventListener("change", function() {
            GM_setValue(setv_, this.checked);
            setv = this.checked;
        });
        let span = document.createElement("span");
        span.className = "checkmark";
        label.appendChild(input);
        label.appendChild(span);
        return label;
    }

    function makeCB_form(setv_, setv, name, desc) {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        let label = document.createElement("label");
        label.className = "block";
        label.innerHTML = name;
        th.appendChild(label);
        let p = document.createElement("p");
        p.innerHTML = desc;
        th.appendChild(p);
        tr.appendChild(th);
        let td = document.createElement("td");
        td.appendChild(makeCB(setv_, setv));
        tr.appendChild(td);
        tbody_options.appendChild(tr);
    }

    makeCB_form(setting_autoplayVideos_, setting_autoplayVideos, "AutoPlay", "Automatically play the video");
    {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        let label = document.createElement("label");
        label.className = "block";
        label.innerHTML = "Default Video Volume";
        th.appendChild(label);
        tr.appendChild(th);

        let data = document.createElement("td");
        let slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "100";
        slider.value = GM_getValue(setting_defaultVideoVolume_, setting_defaultVideoVolume) * 100;
        slider.className = "r34imp_slider";
        let slider_info = document.createElement("p");
        slider_info.style = "display: inline-block;";
        slider_info.innerHTML = "Volume: " + slider.value + "%";
        slider.oninput = function() {
            slider_info.innerHTML = "Volume: " + slider.value + "%";
            GM_setValue(setting_defaultVideoVolume_, slider.value / 100);
        }
        data.appendChild(slider);
        data.appendChild(slider_info);
        tr.appendChild(data);
        tbody_options.appendChild(tr);
    } {
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
        slider.value = GM_getValue(setting_viewportDependentHeight_, setting_viewportDependentHeight);
        slider.className = "r34imp_slider";
        let slider_info = document.createElement("p");
        slider_info.style = "display: inline-block;";
        slider_info.innerHTML = slider.value + "%";
        slider.oninput = function() {
            slider_info.innerHTML = slider.value + "%";
            GM_setValue(setting_viewportDependentHeight_, slider.value);
        }

        data.appendChild(makeCB(setting_useViewportDependentSize_, setting_useViewportDependentSize));
        data.appendChild(slider);
        data.appendChild(slider_info);
        row.appendChild(data);
        tbody_options.appendChild(row);
    }
    makeCB_form(setting_stretchImgVid_, setting_stretchImgVid, "Stretch Image/Video", "This overrides 'True Video Size'");
    makeCB_form(setting_trueVideoSize_, setting_trueVideoSize, "True Video Size", "Resizes videos to their true size");
    makeCB_form(setting_enableFavOnEnter_, setting_enableFavOnEnter, "Enable Fav On Enter", "Use the ENTER key on your keyboard to add a post to your favorites");
    makeCB_form(setting_hideBlacklistedThumbnails_, setting_hideBlacklistedThumbnails, "Hide Blacklisted Thumbnails", "Hide blacklisted thumbnails on the main post page");
    makeCB_form(setting_forceDarkTheme_, setting_forceDarkTheme, "Force Dark Theme", "Force rule34's dark theme on every page");
    makeCB_form(setting_betterDarkTheme_, setting_betterDarkTheme, "Better Dark Theme", "(must enable 'Force Dark Theme') Use a custom CSS dark theme with the rule34's dark theme");
    makeCB_form(setting_removeBloat_, setting_removeBloat, "Remove Bloat", "Removes: hentai clicker game AD, and other bullshit.");
    makeCB_form(setting_endlessScrolling_, setting_endlessScrolling, "Endless Scrolling", "When you get to the bottom of the current page it will automatically append the content from the next page on the current page");
    makeCB_form(setting_favFilter_, setting_favFilter, "Favorites Filter", "Adds a searchbox for tag(s) in favorites");
    makeCB_form(setting_showFavPosts_, setting_showFavPosts, "Show Fav Posts", "Shows you which posts are in your favorites while browsing");
    makeCB_form(setting_showFavPosts2_, setting_showFavPosts2, "Hide Fav Posts", "(must enable 'Show Fav Posts') Hides favorites while browsing");
    makeCB_form(setting_embedVideo_, setting_embedVideo, "Embed Video", "Replace rule34's player with the default browser player");
    makeCB_form(setting_thumbFav_, setting_thumbFav, "Thumb Fav", "Adds a fav button on each post while browsing");
    makeCB_form(setting_mainPageExtra_, setting_mainPageExtra, "Main Page Extra", "Adds a button (on the main page) that expands to a form that allows you to bookmark tags and see super favorites");
    makeCB_form(setting_mainPageExtraAutoExpand_, setting_mainPageExtraAutoExpand, "Auto Expand Main Page Extra", "Auto click the button that shows forms for bookmarking tags & viewing super favorites");
    makeCB_form(setting_slideShow_, setting_slideShow, "Slideshow", "Adds a button in the top right corner, when browsing, to activate slideshow mode");
    makeCB_form(setting_videoVolumeScroll_, setting_videoVolumeScroll, "Video Volume Scroll", "Control video volume with mouse scroll wheel, must 'Embed Video' if viewing from post's page...");
    makeCB_form(setting_loopVideo_, setting_loopVideo, "Loop video", "Make the player loop the video.")
}
// #endregion

// #region FAVORITES PAGE / SEARCHING/FILTERING
if (isPage_fav) {

    //// remove stupid <br>s on fav page wtf... why are they here
    //let bodyc = document.getElementById("body").children;
    //for (let i = 0; i < bodyc.length; i++) { if (bodyc[i].tagName === "BR") { bodyc[i].remove(); } }

    // container for all the controls in favorites
    let div_favcontrols = document.createElement("div");
    div_favcontrols.id = "favcontrols";
    div_favcontrols.style = "margin: 2px 5px 10px 5px;"
    document.getElementById("header").parentNode.insertBefore(div_favcontrols, document.getElementById("header").nextSibling);

    if (setting_favFilter) {
        function slideShow_removeContent() {
            let elements = document.getElementsByClassName("thumb");
            while (elements[0]) {
                elements[0].remove();
            }
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
        input.addEventListener("keydown", function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                main_favFilter();
            }
        });

        // filter/search button
        let btn_filter = document.createElement("button");
        btn_filter.style = "display: inline-block;";
        btn_filter.id = "filterButton";
        btn_filter.title = "Start search"
        btn_filter.innerHTML = "Filter";
        btn_filter.onclick = function() {
            main_favFilter();
        }

        // stop button
        let btn_stop = document.createElement("button");
        btn_stop.style = "display: inline-block;";
        btn_stop.title = "Stop search";
        btn_stop.innerHTML = "Stop";
        btn_stop.onclick = function() {
            shouldStop = true;
        }

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
        slider.min = "0";
        slider.max = "4000";
        slider.value = 1000;
        slider.className = "r34imp_slider";
        slider.id = "delayRange";

        // slider speed label
        let txt_speed = document.createElement("p");
        txt_speed.style = "display: inline-block;";
        txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
        slider.oninput = function() {
            txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
        }

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
            slideShow_removeContent();
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
                        for (let j = 0; j < match.length; j++) {
                            if (!images[i].title.includes(match[j])) {
                                addImage = false;
                                break;
                            }
                        }
                        if (addImage) {
                            pag.parentNode.insertBefore(images[i].parentNode.parentNode, pag);
                            imagesAdded++;
                        }
                    }
                    document.title = "[" + imagesAdded + "] Done!";
                    txt_imageCount.innerHTML = "Images Loaded: " + imagesAdded;
                    txt_status.innerHTML = "Done!";
                });

                await sleep(slider.value);
                if (shouldStop) {
                    shouldStop = false;
                    return;
                }
            }
        };
    }
}
// #endregion

// #region PROCESS MEDIA

if (setting_showFavPosts && setting_showFavPosts2) {
    document.documentElement.style.setProperty('--favdisplay', 'none');
}

function processMedia() {
    if (setting_showFavPosts) {
        // filtering
        if (isPage_posts || isPage_pool) {
            let elements = document.querySelectorAll(".thumb");
            for (let i = 0; i < elements.length; i++) {
                showFavPosts_elementCheck(elements[i]);
            }
        }

        if (isPage_fav) {

            // show fav posts
            let elements = document.querySelectorAll(".thumb");
            for (let i = 0; i < elements.length; i++) {
                showFavPosts_injectRemoveCode(elements[i]);
                showFavPosts_elementCheck(elements[i]);
                thumbFav_check(elements[i]);
            }
        }
    }
}

processMedia();

// #endregion

// #region FAVORITES PAGE / UPDATE 'favlist' / OPEN RANDOM ID
if (setting_showFavPosts) {
    if (isPage_fav) {

        let favlist_len = GM_getValue("favlist", []).length;

        // stuff to update list
        // status
        let status = document.createElement("div");
        status.id = "favlistStatus";
        status.style = "display: block;";
        status.title = "processed\nfavlist count\nadded";
        status.innerHTML = favlist_len;
        // update button
        let btn_updatefav = document.createElement("button");
        btn_updatefav.style = "display: block;";
        btn_updatefav.title = "Updates favorites list (" + favlist_len + " ID(s))";
        btn_updatefav.innerHTML = "Update";

        const slider = document.getElementById("delayRange");

        async function getIds() {
            let reg = /pid=([0-9]*)/gm;
            let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
            if (!base.includes("favorites")) {
                return console.log("not a favorites page");
            };

            // vars
            let step = 50;
            let el = document.getElementsByName("lastpage")[0];
            let maxMatch = reg.exec(el.attributes[1].nodeValue);
            let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
            let curMatch = reg.exec(document.location);
            let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

            let c = 0;
            let added = 0;
            let favlist = GM_getValue("favlist", []);

            // start search
            for (; cur <= max; cur += step) {
                let url = base + "&pid=" + cur;
                const response = await fetch(url);
                const html = await response.text();
                let doc = new DOMParser().parseFromString(html, "text/html");
                let elements = doc.getElementsByClassName("thumb");
                for (let i = 0; i < elements.length; i++) {
                    let id = getPostID(elements[i]);
                    if (!favlist.includes(id)) {
                        favlist.push(id);
                        added++;
                    }
                    c++;
                    let stat_info = "count: " + c + "<br>" + "len: " + favlist.length + "<br>" + "new: " + added;
                    status.innerHTML = stat_info;
                    console.log(stat_info);
                }
                GM_setValue("favlist", favlist);

                await sleep(slider.value);
            }
        }
        btn_updatefav.onclick = function() {
            getIds();
        };

        // random post button
        let btn_random = document.createElement("button");
        btn_random.style = "display: block;";
        btn_random.title = "Open random post from favlist";
        btn_random.innerHTML = "Random";
        btn_random.onclick = function() {
            let favlist = GM_getValue("favlist", []);
            let randomItem = favlist[Math.floor(Math.random() * favlist.length)];
            let url = "https://rule34.xxx/index.php?page=post&s=view&id=" + randomItem;

            window.open(url, '_blank');
        };

        // container for controls
        let favlistCont = document.createElement("div");
        favlistCont.style = "position: fixed; top: 30px; right: 5px;";
        favlistCont.appendChild(btn_updatefav);
        favlistCont.appendChild(btn_random);
        favlistCont.appendChild(status);
        document.body.appendChild(favlistCont);
    }
}
// #endregion

// #region SLIDESHOW


// top right container
let div_trcont = document.createElement("div");
div_trcont.id = "trcont";
div_trcont.style = "position: fixed; top: 5px; right: 5px;";
if (!(isPage_posts || isPage_fav)) { div_trcont.style = "display: none;" }

let div_trcont_endless_scroll = document.createElement("label");
div_trcont_endless_scroll.className = "checkboxContainer";
div_trcont_endless_scroll.title = "Enable endless scrolling";
div_trcont_endless_scroll.id = "trcheckbox";
let div_trcont_endless_scroll_input = document.createElement("input");
div_trcont_endless_scroll_input.type = "checkbox";
div_trcont_endless_scroll_input.checked = setting_endlessScrolling;
div_trcont_endless_scroll_input.addEventListener("change", function() {
    GM_setValue(setting_endlessScrolling_, this.checked);
    setting_endlessScrolling = this.checked;
});
let div_trcont_endless_scroll_span = document.createElement("span");
div_trcont_endless_scroll_span.className = "checkmark";
div_trcont_endless_scroll.appendChild(div_trcont_endless_scroll_input);
div_trcont_endless_scroll.appendChild(div_trcont_endless_scroll_span);
div_trcont.append(div_trcont_endless_scroll);

// hide fav posts checkbox
let div_trcont_hide_favs = document.createElement("label");
div_trcont_hide_favs.className = "checkboxContainer";
div_trcont_hide_favs.title = "Hide favorites";
div_trcont_hide_favs.id = "trcheckbox";
let div_trcont_hide_favs_input = document.createElement("input");
div_trcont_hide_favs_input.type = "checkbox";
div_trcont_hide_favs_input.checked = setting_showFavPosts2;
div_trcont_hide_favs_input.addEventListener("change", function() {
    GM_setValue(setting_showFavPosts2_, this.checked);
    setting_showFavPosts2 = this.checked;
    document.documentElement.style.setProperty('--favdisplay', (div_trcont_hide_favs_input.checked ? "none" : "inline"));
});
let div_trcont_hide_favs_span = document.createElement("span");
div_trcont_hide_favs_span.className = "checkmark";
div_trcont_hide_favs.appendChild(div_trcont_hide_favs_input);
div_trcont_hide_favs.appendChild(div_trcont_hide_favs_span);
div_trcont.append(div_trcont_hide_favs);
if (!setting_showFavPosts) { div_trcont_hide_favs.style = "display: none;" }


let div_slideShow_showing = false;

let div_slideShow = document.createElement("div");
div_slideShow.style = "position: fixed; width: 100%; height: 100%; margin: 3px; top: 0; left: 0; right: 0; bottom: 0; z-index: 2; background: rgba(0, 0, 0, 0.6)";
div_slideShow.style.display = "none";
div_slideShow.className = "slideShow_class_backNnext";

let button_slideShow_show = document.createElement("button");
button_slideShow_show.style = "cursor: pointer; width: 20px; height: 20px; background: #303030; padding: 0; margin: 2px; border: 1px solid green; color: lime";
button_slideShow_show.innerHTML = "▶️";
button_slideShow_show.title = "Show Slideshow";

let cssStyle_slideShowButtons = "float: right; cursor: pointer; width: 30px; height: 30px; background: black; border-radius: 20px; padding: 0; margin: 2px; border: 2px solid green; color: lime";

let div_slideShow_btnCont = document.createElement("div");
div_slideShow_btnCont.style = "width: 250px; height: 34px; float: right;";
div_slideShow_btnCont.className = "slideShow_class_backNnext";

let button_slideShow_hide = document.createElement("button");
button_slideShow_hide.style = cssStyle_slideShowButtons;
button_slideShow_hide.style.marginRight = "5px";
button_slideShow_hide.innerHTML = "❌";
button_slideShow_hide.title = "Close Slideshow";

let button_slideShow_back = document.createElement("button");
button_slideShow_back.innerHTML = "⏮️";
button_slideShow_back.style = cssStyle_slideShowButtons;
button_slideShow_back.title = "Previous Post (A/LEFT ARROW)";

let button_slideShow_next = document.createElement("button");
button_slideShow_next.innerHTML = "⏭️";
button_slideShow_next.style = cssStyle_slideShowButtons;
button_slideShow_next.title = "Next Post (D/RIGHT ARROW)";

let button_slideShow_fav = document.createElement("button");
button_slideShow_fav.innerHTML = "❤️";
button_slideShow_fav.style = cssStyle_slideShowButtons;
button_slideShow_fav.title = "Add to favorites (S/Enter)";

let button_slideShow_fav2 = document.createElement("button");
button_slideShow_fav2.innerHTML = "💚";
button_slideShow_fav2.style = cssStyle_slideShowButtons;
button_slideShow_fav2.title = "Add to super favorites (W)";

let button_slideShow_help = document.createElement("button");
button_slideShow_help.innerHTML = "ℹ️";
button_slideShow_help.style = cssStyle_slideShowButtons;
button_slideShow_help.title = "Show Help";

let currentPost_element = null;
let currentPost_element_id = null;

function currentPost_element_update(element) {
    if (currentPost_element != null) { currentPost_element.classList.remove("r34imp_slideshow_current") }
    currentPost_element = element;
    currentPost_element.classList.add("r34imp_slideshow_current")
    currentPost_element_id = getPostID(currentPost_element);
}

function slideShow_updateUI() {

    let isfav = favlist_contains(currentPost_element_id);
    let isfav2 = favlist2_contains(currentPost_element_id);

    button_slideShow_fav.style.display = isfav ? "none" : "inline-block";
    button_slideShow_fav2.style.display = isfav2 ? "none" : "inline-block";

    let RGB_lime = "RGBA(0,   255,   0, 0.6)";
    let RGB_green = "RGBA(0,   128,   0, 0.6)"
    let RGB_hotpink = "RGBA(255, 105, 180, 0.6)";
    let RGB_purple = "RGBA(128,   0, 128, 0.6)";

    if (isfav && isfav2) {
        div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_green + ", " + RGB_purple + ")";
    } else if (isfav) {
        div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_hotpink + ", " + RGB_purple + ")";
    } else if (isfav2) {
        div_slideShow.style.background = "linear-gradient(to bottom, " + RGB_lime + ", " + RGB_green + ")";
    } else {
        div_slideShow.style.background = "rgba(0, 0, 0, 0.6)";
    }

    showFavPosts_elementUpdate(currentPost_element, isfav, isfav2);
}

function checkIfImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)/) != null);
}

function checkIfVideo(url) {
    return (url.match(/\.(mp4|webm)/) != null);
}

function slideShow_removeContent() {
    let priv = div_slideShow.querySelector("#slideShow_content");
    if (priv) {
        priv.remove();
    }
    let priv2 = div_slideShow.querySelector("#slideShow_content_preview");
    if (priv2) {
        priv2.remove();
    }
}

function slideShow_video_vol(content, delta) {
    if (content.tagName != "VIDEO") {
        return;
    }
    let curVol = content.volume;
    if (delta == 1) {
        curVol += 0.05;
    } else if (delta == -1) {
        curVol -= 0.05;
    }

    if (curVol > 1) {
        content.volume = curVol = 1;
    } else if (curVol < 0) {
        content.volume = curVol = 0;
    } else {
        content.volume = curVol;
    }
}

function slideShow_showContent() {
    // remove priv content
    slideShow_removeContent();

    if (!currentPost_element || !currentPost_element_id) {
        console.log("nothing to slideshow :/ ???");
        return;
    }

    // scroll into view
    currentPost_element.scrollIntoView();


    // update buttons fav/fav2/bg
    slideShow_updateUI();

    // get og image/video url
    let contentURL = GetOG(currentPost_element_id);

    // load preview
    let img_preview = currentPost_element.querySelector(".preview").cloneNode();
    img_preview.style = "position: fixed; bottom: 1px; right: 1px; z-index: -1";

    let a_preview = document.createElement("a");
    a_preview.id = "slideShow_content_preview";
    a_preview.href = "index.php?page=post&s=view&id=" + currentPost_element_id;
    a_preview.append(img_preview);

    div_slideShow.append(a_preview);

    // load og image/video
    if (checkIfImage(contentURL)) {
        let content = document.createElement("img");
        content.id = "slideShow_content";
        content.className = "slideShow_class_backNnext";
        content.style = "display: block; margin: auto auto; width: auto; height: auto; max-width: calc(100% - 35px); max-height: calc(100% - 35px);";
        content.src = contentURL;
        div_slideShow.append(content);
    } else if (checkIfVideo(contentURL)) { // video
        let content = document.createElement("video");
        content.id = "slideShow_content";
        //content.className = "slideShow_class_backNnext";
        content.style = "display: block; margin: auto auto; width: auto; height: auto; max-width: calc(100% - 35px); max-height: calc(100% - 35px);";
        content.controls = true;
        content.volume = setting_defaultVideoVolume;
        content.autoplay = setting_autoplayVideos;
        content.addEventListener('volumechange', (event) => {
            GM_setValue(setting_defaultVideoVolume_, content.volume);
            setting_defaultVideoVolume = content.volume;
        });

        if (setting_videoVolumeScroll) {
            let current = 0;
            let MouseWheelHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                e = window.event || e;
                let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                current = current + delta;
                slideShow_video_vol(content, delta);
                return false;
            };

            if (content.addEventListener) {
                // IE9, Chrome, Safari, Opera
                content.addEventListener("mousewheel", MouseWheelHandler, false);
                // Firefox
                content.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
            }
        }

        content.src = contentURL;
        div_slideShow.append(content);
    } else {
        console.log("idk if this is a video or image? :V --> " + contentURL);
    }
}

function slideShow_next() {
    if (!currentPost_element.nextElementSibling) {
        return;
    }
    currentPost_element_update(currentPost_element.nextElementSibling);
    if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) {
        slideShow_next();
    }
}

function slideShow_back() {
    if (!currentPost_element.previousElementSibling) {
        return;
    }
    currentPost_element_update(currentPost_element.previousElementSibling);
    if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) {
        slideShow_back();
    }
}

function slideShow_nextNshow() {
    slideShow_next();
    slideShow_showContent();
}

function slideShow_backNshow() {
    slideShow_back();
    slideShow_showContent();
}

function slideShow_fav() {
    if (currentPost_element) {
        favPost(currentPost_element_id, function() {
            slideShow_updateUI();
        });
    }
}

function slideShow_fav2() {
    if (currentPost_element) {
        favPost2(currentPost_element_id);
        slideShow_updateUI();
    }
}

function slideShow_help() {
    alert(
        "Q - exit slideshow + focus on search query textbox\n" +
        "ESCAPE - close slideshow / unfocus search query textbox\n" +
        "ENTER - search (must unfocus search query textbox first)\n" +
        "E - Toggle endless scrolling\n" +
        "H - Toggle hiding favorites\n" +
        "S - Toggle slideshow\n" +
        "F - Add post to favorites\n" +
        "G - Add post to superfavs\n" +
        "A / LEFT ARROW  - move left\n" +
        "D / RIGHT ARROW - move right\n"
    );
}

button_slideShow_next.addEventListener("click", function() { slideShow_nextNshow(); });
button_slideShow_back.addEventListener("click", function() { slideShow_backNshow(); });
button_slideShow_fav.addEventListener("click", function() { slideShow_fav(); });
button_slideShow_fav2.addEventListener("click", function() { slideShow_fav2(); });
button_slideShow_help.addEventListener("click", function() { slideShow_help(); });

let side = 0;
div_slideShow.addEventListener('mousemove', function(event) {
    if (event.target.classList.contains("slideShow_class_backNnext")) {
        if (event.pageX > (div_slideShow.offsetWidth / 2)) {
            div_slideShow.style.cursor = "e-resize";
            side = 1;
        } else {
            div_slideShow.style.cursor = "w-resize";
            side = 2;
        }
    } else {
        div_slideShow.style.cursor = "auto";
        side = 0;
    }
});

div_slideShow.addEventListener('click', function(event) {
    if (!event.target.classList.contains("slideShow_class_backNnext") || event.buttons != 0) {
        return;
    }
    if (side == 1) {
        slideShow_nextNshow();
    } else if (side == 2) {
        slideShow_backNshow();
    }
}, true);

div_slideShow.addEventListener("click", function() { });

// append all buttons and stuff
div_slideShow_btnCont.append(button_slideShow_hide);
div_slideShow_btnCont.append(button_slideShow_next);
div_slideShow_btnCont.append(button_slideShow_back);
div_slideShow_btnCont.append(button_slideShow_fav2);
div_slideShow_btnCont.append(button_slideShow_fav);
div_slideShow_btnCont.append(button_slideShow_help);
div_slideShow.append(div_slideShow_btnCont);

function slideShow_show() {

    div_slideShow_showing = true;

    div_slideShow.style.display = "block"; // show slideshow
    button_slideShow_show.style.display = "none"; // hide button

    // show first element
    let spans = document.getElementsByClassName("thumb");
    if (currentPost_element == null && spans.length >= 1) {
        currentPost_element_update(spans[0]);
        if (setting_showFavPosts2 && currentPost_element.classList.contains("fav")) {
            slideShow_next();
        }
    }
    slideShow_showContent();

    // setup shortcut keys
    document.onkeydown = function(e) {
        if (e.code === 'ArrowUp') {
            slideShow_video_vol(document.getElementById("slideShow_content"), 1);
        } else if (e.code === 'ArrowDown') {
            slideShow_video_vol(document.getElementById("slideShow_content"), -1);
        }
        e.stopPropagation();
        e.preventDefault();

        e.returnValue = false;
        e.cancelBubble = true;
        return false;
    };
}

function slideShow_hide() {

    div_slideShow_showing = false;

    // hide content
    slideShow_removeContent();

    document.onkeydown = null;

    // rehook autocomplete
    autocomplete_setup();

    div_slideShow.style.display = "none"; // hide slideshow
    button_slideShow_show.style.display = "inline-block"; // show button
}

function slideShow_toggle() {
    if (div_slideShow_showing) { slideShow_hide(); } else { slideShow_show(); }
}


button_slideShow_show.addEventListener("click", function() { slideShow_show(); });
button_slideShow_hide.addEventListener("click", function() { slideShow_hide(); });

div_trcont.append(button_slideShow_show);
document.body.append(div_slideShow);

// #endregion

// #region endless scrolling checkbox
if (isPage_posts || isPage_fav) {

    let p_endlessScroll = document.createElement("p");
    p_endlessScroll.id = "endlessScrolling_p";
    p_endlessScroll.style = "display: block; float: left;";
    p_endlessScroll.innerHTML = "";
    div_trcont.append(p_endlessScroll);

    document.body.appendChild(div_trcont);

    function isInViewport(myElement) {
        let bounding = myElement.getBoundingClientRect();
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
                if (els.length == 0) {
                    return;
                }
                el = els[0];
                text = el.attributes[1].nodeValue;
                break;
            }
            default:
                return;
        }
        let maxMatch = reg.exec(text);
        let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
        let curMatch = /pid=([0-9]*)/gm.exec(add);
        let cur = curMatch == null ? 0 : parseInt(curMatch[1]);
        let div_imageList = document.querySelector(".image-list");
        let paginator = document.getElementById("paginator");
        let content = document.querySelector("#content");

        let scrollend = document.createElement("div");
        scrollend.id = "scrollend";
        document.body.appendChild(scrollend);

        if (isPage_fav) {
            window.addEventListener("scroll", async function() {
                if (reachedTheEnd || !setting_endlessScrolling || !isInViewport(scrollend)) {
                    return;
                }
                if (!setting_endlessScrolling) {
                    return;
                }
                cur += step;
                let url = base + "&pid=" + cur;
                document.title = "Loading...";
                httpGet(url, function(response) {
                    document.title = originalTitle;
                    let doc = new DOMParser().parseFromString(response, "text/html");
                    const dcon = doc.querySelector("#content");
                    for (let i = 0; i < dcon.childNodes.length; i++) {
                        content.appendChild(dcon);
                    }
                    processMedia();
                    p_endlessScroll.innerHTML = cur + " (" + ((cur + step) / step) + ")";
                }, false);
            });
        } else {
            window.addEventListener("scroll", async function() {
                if (reachedTheEnd || !setting_endlessScrolling || !isInViewport(paginator)) { return; }
                if (!setting_endlessScrolling) { return; }
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
                        div_imageList.append(elements[i]);

                        if (setting_hideBlacklistedThumbnails) { hideBlacklistedThumbnails_check(elements[i]); }
                        if (setting_showFavPosts) { showFavPosts_elementCheck(elements[i]); }
                        if (setting_thumbFav) { thumbFav_check(elements[i]); }
                    }
                    p_endlessScroll.innerHTML = cur + " (" + ((cur + step) / step) + ")";
                }, false);
            });
        }


    };

    main_scroll();
}

// #endregion

// #region post view (default vol, size the image/vid, add buttons)
if (isPage_post) {

    // set vars
    let postID = document.location.href.split("id=")[1].split("&")[0];

    // add custom css
    GM_addStyle(css_post);

    // video settings
    let vid = document.querySelector("#gelcomVideoPlayer");
    if (vid) {
        vid.volume = setting_defaultVideoVolume;
        if (!setting_embedVideo) {
            vid.autoplay = setting_autoplayVideos;
        }
        if (!setting_stretchImgVid && setting_trueVideoSize) {
            let size = document.querySelector("#stats > ul:nth-child(2) > li:nth-child(3)").innerHTML.split(": ")[1];
            let wNh = size.split("x");
            let w = wNh[0];
            let h = wNh[1];
            vid.style = "width: " + w + "px; max-width: 100%; height: " + h + "px;";
        }
        if (setting_loopVideo) {
            video.loop = true;
        }
    }

    // buttons and stuff
    let navbar = document.getElementById("subnavbar");
    let cont = document.createElement("div");
    cont.id = "postbar";

    let btn_like = document.createElement("button");
    btn_like.className = "custom-button";
    btn_like.innerHTML = "👍like";
    btn_like.onclick = function() {
        post_vote(postID, 'up');
    };
    cont.appendChild(btn_like);

    let btn_fav = document.createElement("button");
    btn_fav.className = "custom-button";
    btn_fav.innerHTML = "❤️fav";
    btn_fav.onclick = function() {
        favPost(postID);
    };
    cont.appendChild(btn_fav);

    let btn_close = document.createElement("button");
    btn_close.className = "custom-button";
    btn_close.innerHTML = "❌close";
    btn_close.onclick = function() {
        window.close();
    };
    cont.appendChild(btn_close);

    let btn_favclose = document.createElement("button");
    btn_favclose.className = "custom-button";
    btn_favclose.innerHTML = "❤️+❌favclose";
    btn_favclose.onclick = function() {
        favPost(postID, function() {
            window.close = true;
        });
    };
    cont.appendChild(btn_favclose);

    let btn_prev = document.createElement("button");
    btn_prev.className = "custom-button";
    btn_prev.innerHTML = "⏮️prev";
    btn_prev.onclick = function() {
        document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").click();
    };
    cont.appendChild(btn_prev);

    let btn_next = document.createElement("button");
    btn_next.className = "custom-button";
    btn_next.innerHTML = "⏭️next";
    btn_next.onclick = function() {
        document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)").click();
    };
    cont.appendChild(btn_next);

    let btn_fav2 = document.createElement("button");
    btn_fav2.className = "custom-button";
    btn_fav2.innerHTML = "💚superfav";
    btn_fav2.onclick = function() {
        favPost2(postID);
    };
    cont.appendChild(btn_fav2);

    navbar.appendChild(cont);

    // show if a post is in fav
    updateSubnavbar(postID);

    if (setting_embedVideo) {
        embedDefaultVideo();
    }
}
// #endregion

// #region MAIN PAGE EXTRA

if (setting_mainPageExtra) {

    if (isPage_main) {

        function loadExtraContent() {
            let main_flexbox = document.createElement("div");
            main_flexbox.style = "display: flex; flex-direction: row; justify-content: center;"
            document.body.prepend(main_flexbox);

            main_flexbox.append(document.getElementById("static-index"));

            let tagbar = document.createElement("div");
            tagbar.className = "tagbar";
            tagbar.style = "height: auto; margin: 10px 100px; padding: 5px; border-radius: 3px";
            let favTagsDiv_h5 = document.createElement("h5");
            favTagsDiv_h5.innerHTML = "Bookmarked/Favorite Tags (CTRL+ENTER)";
            tagbar.appendChild(favTagsDiv_h5);

            let tagbarquick = document.createElement("div");
            tagbarquick.className = "tagbarquick";
            tagbarquick.style = "height: auto; margin: 10px 100px; padding: 5px; border-radius: 3px";
            let tagbarquick_h5 = document.createElement("h5");
            tagbarquick_h5.innerHTML = "Quick Append Search (CTRL+SHIFT+ENTER)";
            tagbarquick.appendChild(tagbarquick_h5);

            function tagbar_add(text) {
                let div = document.createElement("div");
                div.style = "padding-bottom: 5px;"
                div.className = "favtag";

                let a = document.createElement("a");
                let rm = document.createElement("button");
                rm.style = "cursor: pointer; background: none; border: none;";
                rm.innerHTML = "❌";
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
                tagbar.appendChild(div);
            }

            function tagbar_sort() {
                let elements = document.getElementsByClassName("favtag");
                while (elements[0]) { elements[0].remove(); }
                let tl = GM_getValue("taglist", []);
                tl.sort();
                for (let i = 0; i < tl.length; i++) { tagbar_add(tl[i]); }
                GM_setValue("taglist", tl);
            }

            function tagbarquick_add(text) {
                let div = document.createElement("div");
                div.style = "padding-bottom: 5px;"
                div.className = "favtagquick";

                let a = document.createElement("a");
                let rm = document.createElement("button");
                rm.style = "cursor: pointer; background: none; border: none;";
                rm.innerHTML = "❌";
                rm.title = "Remove";
                rm.onclick = function() {
                    let taglist = GM_getValue("taglistquick", []);
                    GM_setValue("taglistquick", taglist.filter(e => e !== text));
                    div.remove();
                }

                a.innerHTML = text;
                a.href = "index.php?page=post&s=list&tags=" + text;
                div.appendChild(rm);
                div.appendChild(a);
                tagbarquick.appendChild(div);
            }

            function tagbarquick_sort() {
                let elements = document.getElementsByClassName("favtagquick");
                while (elements[0]) { elements[0].remove(); }
                let tl = GM_getValue("taglistquick", []);
                tl.sort();
                for (let i = 0; i < tl.length; i++) { tagbarquick_add(tl[i]); }
                GM_setValue("taglistquick", tl);
            }

            let input = document.getElementById("tags");

            function taglist_add() {
                let value = input.value.trim();
                if (!value) { return; }
                let taglist = GM_getValue("taglist", []);
                if (!taglist.includes(value)) {
                    taglist.push(value);
                    GM_setValue("taglist", taglist);
                    tagbar_add(value);
                    input.value = "";
                }
            }

            function taglistquick_add() {
                let value = input.value.trim();
                if (!value) { return; }
                let taglist = GM_getValue("taglistquick", []);
                if (!taglist.includes(value)) {
                    taglist.push(value);
                    GM_setValue("taglistquick", taglist);
                    tagbarquick_add(value);
                    input.value = "";
                }
            }

            input.addEventListener("keydown", function(event) {
                 if (event.ctrlKey && event.shiftKey && event.key === 'Enter') { taglistquick_add(); }
                 else if (event.ctrlKey && event.key === 'Enter') { taglist_add(); }
            });

            let btn_bookmark = document.createElement("button");
            btn_bookmark.className = "r34imp_button";
            btn_bookmark.innerHTML = "🔖 Bookmark";
            btn_bookmark.onclick = function(e) {
                e.preventDefault();
                taglist_add();
            };
            btn_bookmark.title = "Bookmark search query (CTRL+ENTER)";

            let btn_bookmark2 = document.createElement("button");
            btn_bookmark2.className = "r34imp_button";
            btn_bookmark2.innerHTML = "🔖 Add QAS";
            btn_bookmark2.onclick = function(e) {
                e.preventDefault();
                taglistquick_add();
            };
            btn_bookmark2.title = "Add quick append search (CTRL+SHIFT+ENTER)";

            let btn_tagbar_sort = document.createElement("button");
            btn_tagbar_sort.className = "r34imp_button";
            btn_tagbar_sort.innerHTML = "🔢 Sort";
            btn_tagbar_sort.onclick = function() { tagbar_sort(); };
            btn_tagbar_sort.title = "Sort";

            let btn_tagbarquick_sort = document.createElement("button");
            btn_tagbarquick_sort.className = "r34imp_button";
            btn_tagbarquick_sort.innerHTML = "🔢 Sort";
            btn_tagbarquick_sort.onclick = function() { tagbarquick_sort(); };
            btn_tagbarquick_sort.title = "Sort";

            input.after(btn_bookmark);
            btn_bookmark.after(btn_bookmark2);
            tagbar.appendChild(btn_tagbar_sort);
            tagbarquick.appendChild(btn_tagbarquick_sort);

            // populate
            let tl = GM_getValue("taglist", []);
            for (let i = 0; i < tl.length; i++) { tagbar_add(tl[i]); }

            let tlq = GM_getValue("taglistquick", []);
            for (let i = 0; i < tlq.length; i++) { tagbarquick_add(tlq[i]); }

            let superFavDiv = document.createElement("div");
            superFavDiv.className = "superFavCont";
            superFavDiv.style = "height: auto; margin-bottom: 500px; width: auto";

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
                span.style = "border: none; position: relative; padding-left: 10px; padding-right: 2px; margin: 5px; width: 210px; height: 210px";
                span.className = "thumb sfav";

                let a = document.createElement("a");
                a.style.border = "none";
                a.id = "p" + id;
                a.href = "index.php?page=post&s=view&id=" + id;

                let img = document.createElement("img");
                img.className = "preview";
                img.style = "display: block; border: none; object-fit: fill; max-width: 200px; max-height: 200px";
                img.alt = id;
                img.src = thumbURL;
                a.appendChild(img);

                let btn_rm = document.createElement("Remove");
                btn_rm.innerHTML = "❌ Remove";
                btn_rm.title = "Remove from Super Favorites"
                btn_rm.style = "cursor: pointer; margin-top: 10px; display: block;"
                btn_rm.onclick = function() {
                    favlist.splice(i, 1);
                    GM_setValue("favlist2", favlist);
                    span.remove();
                }

                span.appendChild(a);
                span.appendChild(btn_rm);

                superFavDiv.appendChild(span);
            }

            main_flexbox.appendChild(tagbar);
            main_flexbox.appendChild(tagbarquick);
            document.body.append(main_flexbox);

            document.body.appendChild(superFavDiv);
        }

        function expand_extra_content() {
            loadExtraContent();
            btn_expand.remove();
        }

        let btn_expand = document.createElement("btn_expand");
        btn_expand.id = "expand-button";
        btn_expand.innerHTML = "🔽 Show Extra Content";
        btn_expand.title = "Expand";
        btn_expand.style = "position: fixed; top: 5px; right: 5px; cursor: pointer; border: darkgreen 2px dashed; width: 150px; height: 20px; text-align: center; padding: 5px;"
        btn_expand.onclick = function() { expand_extra_content(); }
        document.body.appendChild(btn_expand);

        if (setting_mainPageExtraAutoExpand) {
            expand_extra_content();
        }

    }

    if (isPage_posts || isPage_post) {

        let input = document.querySelector("#post-list input[type=text][name='tags']");
        if (input == null) { input = document.querySelector("#post-view input[type=text][name='tags']"); }

        if (input != null) {

            let btn_bookmark = document.createElement("button");
            btn_bookmark.className = "r34imp_button";
            btn_bookmark.innerHTML = "🔖 Bookmark";
            btn_bookmark.title = "Bookmark search query (CTRL+ENTER)";

            let btn_bookmark2 = document.createElement("button");
            btn_bookmark2.className = "r34imp_button";
            btn_bookmark2.innerHTML = "🔖 Add QAS";
            btn_bookmark2.title = "Add quick append search (CTRL+SHIFT+ENTER)";

            function taglist_add() {
                let value = input.value.trim();
                if (!value) { return; }
                let taglist = GM_getValue("taglist", []);
                if (!taglist.includes(value)) {
                    taglist.push(value);
                    GM_setValue("taglist", taglist);
                }
            }

            function tagbarquick_add(e) {
                let a = document.createElement("a");
                a.innerHTML = e;
                a.style = "display: block";
                a.href = window.location.href + "+" + e;
                btn_bookmark2.after(a);
            }

            function taglistquick_add() {
                let value = input.value.trim();
                if (!value) { return; }
                let taglist = GM_getValue("taglistquick", []);
                if (!taglist.includes(value)) {
                    taglist.push(value);
                    GM_setValue("taglistquick", taglist);
                    tagbarquick_add(value);
                }
            }

            btn_bookmark.onclick = function(e) { e.preventDefault(); taglist_add(); };
            btn_bookmark2.onclick = function(e) { e.preventDefault(); taglistquick_add(); };

            input.addEventListener("keydown", function(event) {
                if (event.ctrlKey && event.shiftKey && event.key === 'Enter') { taglistquick_add(); }
                else if (event.ctrlKey && event.key === 'Enter') { taglist_add(); }
                else if (event.key === 'Escape') { document.activeElement.blur(); document.body.focus(); }
            });

            input.after(btn_bookmark);
            btn_bookmark.after(btn_bookmark2);

            // populate
            let taglistquick = GM_getValue("taglistquick", []);
            for (let i = 0; i < taglistquick.length; i++) {
                tagbarquick_add(taglistquick[i]);
            }
        }
    }
}

// #endregion

// #region global shortcuts
document.addEventListener('keydown', function(e) {
    let event = document.all ? window.event : e;
    switch (e.target.tagName.toLowerCase()) {
        case "input":
        case "textarea":
        case "select":
        case "button":
        case "tags":
        case "comment": return;
    }

    if (event.key === 'Enter' || e.code === 'KeyR') {
        let input = document.querySelector("#post-list input[type=text][name='tags']");
        if (input == null) { input = document.querySelector("#post-view input[type=text][name='tags']"); }
        let form = input.closest("form");
        form.submit();
    }

    if (setting_enableFavOnEnter && isPage_post && event.key === 'Enter') {
        let postID = document.location.href.split("id=")[1].split("&")[0];
        favPost(postID);
    }

    if (setting_slideShow) {
        if (e.code === 'KeyF' || e.code === 'Enter') {
            slideShow_fav();
        } else if (e.code === 'KeyG') {
            slideShow_fav2();
        } else if (e.code === 'KeyE') {
            div_trcont_endless_scroll_input.checked = !div_trcont_endless_scroll_input.checked;

            const event = new Event('change', {
              'bubbles': true,
              'cancelable': true
            });
            div_trcont_endless_scroll_input.dispatchEvent(event);
        } else if (e.code === 'KeyH') {
            div_trcont_hide_favs_input.checked = !div_trcont_hide_favs_input.checked;

            const event = new Event('change', {
              'bubbles': true,
              'cancelable': true
            });
            div_trcont_hide_favs_input.dispatchEvent(event);
        } else if (e.code === 'Escape') {
            slideShow_hide();
        } else if (e.code === 'KeyS') {
            slideShow_toggle();
        } else if (e.code === 'KeyQ') {
            slideShow_hide();
            let input = document.querySelector("#post-list input[type=text][name='tags']");
            if (input == null) { input = document.querySelector("#post-view input[type=text][name='tags']"); }
            input.focus();
            input.select();
            e.preventDefault();

        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            slideShow_backNshow();
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            slideShow_nextNshow();
        }
    }
});
// #endregion
