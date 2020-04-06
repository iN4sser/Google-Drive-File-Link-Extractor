// ==UserScript==
// @name         Google Drive Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Soon
// @author       iN4sser
// @match        *://drive.google.com/drive/*
// @updateURL    https://github.com/iN4sser/Google-Drive-File-Link-Extractor/raw/master/Google-Drive-Link-Extractor.user.js
// @downloadURL  https://github.com/iN4sser/Google-Drive-File-Link-Extractor/raw/master/Google-Drive-Link-Extractor.user.js
// @grant        none
// ==/UserScript==

//waiting for page loading done and then show the button
window.onload = function(){
    var input=document.createElement("input");
    input.type="button";
    input.value="Extract Links!";
    input.onclick = go;
    input.setAttribute("style", "font-size:18px;position:absolute;top:700px;left:28px");
    document.body.appendChild(input);
};

function go(){
    var a = document.createElement("a");
    var html = ""; //string for the .txt content
    var m = document.getElementsByClassName('WYuW0e'); //find the number of file
    if(m.length>0){
        for(var i=0;i<m.length;i++)
        {
            html += 'https://drive.google.com/file/d/' + m[i].dataset.id + '/preview\n'; //generate html code for all of photos
        }
        a.href += "data:text,"+ html; //write to .txt file
        a.download = "html.txt"; //download .txt file
        a.click();
    }
}

//adding quick "preview" link in the share button
var observer = new MutationObserver(function(mutations) {

    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var node = mutation.addedNodes[i];

            if (node.dataset.target === 'linkBubble') {
                var link = node.getElementsByTagName('input')[0];
                var directLink = link.cloneNode(true);
                directLink.classList.remove('H-qa-A-zt');
                directLink.value = 'https://drive.google.com/file/d/'+ node.parentNode.dataset.id +'/preview';
                directLink.onclick = function() { this.select(); };
                var label = document.createElement('p');
                label.style.cssText = "margin-top: 0px; margin-bottom: 0px;";
                label.textContent = 'Direct link:';
                link.parentNode.insertBefore(directLink, link.nextSibling);
                link.parentNode.insertBefore(label, link.nextSibling);
                break;
            }
            else setClickEvent(node);
        }
    });
});
var content = document.getElementById('drive_main_page');
if (content) observer.observe(content, { childList: true, subtree: true });

function setClickEvent(elem) {
    if (elem.classList && (elem.classList.contains('WYuW0e'))) {
        elem.addEventListener('contextmenu', adjustMenu);
    }
    else {
        for (var i = 0; i < elem.children.length; i++) {
            setClickEvent(elem.children[i]);
        }
    }
}

function adjustMenu() {
    var file = this;

    setTimeout(function() {
        var menus = document.getElementsByClassName('h-w');

        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            if (menu.style.display !== 'none') {
                var existing = document.getElementById('DLID');
                if (existing) existing.remove();

                var container = menu.children[0];
                var preview = Array.from(container.querySelectorAll('.h-v')).find((node) => node.style.display !== 'none');
                var clone = preview.cloneNode(true);
                clone.id = 'DLID';
				clone.style.display = 'block';
				clone.className = 'h-v';
                clone.getElementsByClassName('a-v-T')[0].innerHTML = 'Open direct';

                clone.onmouseleave = clone.onmouseenter = function() {
                    this.classList.toggle('h-v-pc');
                };
                clone.onclick = function() {
                    window.open('https://drive.google.com/uc?id='+ file.dataset.id);
                };

                container.insertBefore(clone, preview.nextSibling);
                break;
            }
        }
    });
}
