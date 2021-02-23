function changeText() {
    var name =  new URLSearchParams(window.location.search).get('name') ?? '';
    document.getElementById("dispaly-text").innerHTML = 'Your name: ' + name;
}

window.onload = () => {
    changeText()
}