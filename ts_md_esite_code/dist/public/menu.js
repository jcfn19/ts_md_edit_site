function openNavf() {
    const sidenav = document.getElementById("idSidenav");
    sidenav.style.width = "250px";
}
const opennavbutton = document.getElementById('openNav');
opennavbutton.onclick = openNavf;
function closeNavf() {
    const sidenav = document.getElementById("idSidenav");
    sidenav.style.width = "0";
}
const closenavbutton = document.getElementById('closeNav');
closenavbutton.onclick = closeNavf;
export {};
//# sourceMappingURL=menu.js.map