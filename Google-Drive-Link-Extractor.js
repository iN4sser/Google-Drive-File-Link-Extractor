// ==UserScript==
// @name         Google Drive Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Soon
// @author       iN4sser
// @match        *://drive.google.com/drive/*
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
