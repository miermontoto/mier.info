const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "/static/css/global/highlight.css";
document.head.append(link);

const script = document.createElement("script");
script.src = "/static/js/global/highlight.umd.js";
script.addEventListener("load", () => hljs.highlightAll() );
document.head.append(script);
