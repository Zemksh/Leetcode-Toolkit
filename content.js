console.log("VERSION 0.1b");
const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");

(document.head||document.documentElement).appendChild(script);
script.onload = () =>script.remove();
