
const navMenu=document.getElementById('nav-menu');
const navLink=document.getElementById('nav-link');
const navCross=document.getElementById('nav-cross');

function showMenu(){
    navLink.style.right='0px';
}
function hideMenu(){
    navLink.style.right='-200px';
}
navMenu.addEventListener('click',showMenu);
navCross.addEventListener('click',hideMenu);

// let header = document.getElementsByClassName("text-box")[0]
let body1 = document.getElementById("main_body")
// header.addEventListener("click", hideMenu)
body1.addEventListener("click", hideMenu)