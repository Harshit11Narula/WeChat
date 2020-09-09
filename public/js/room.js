var username = Qs.parse(location.search, { ignoreQueryPrefix: true }).username;
document.getElementById("reactRoom").value = username;
document.getElementById("angularRoom").value = username;
document.getElementById("vueRoom").value = username;
document.getElementById("html5Room").value = username;
