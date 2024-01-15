const script = document.createElement("script");
script.src = "/static/js/global/quicklink.umd.js";
script.addEventListener("load", () => quicklink.listen());
document.head.append(script);
