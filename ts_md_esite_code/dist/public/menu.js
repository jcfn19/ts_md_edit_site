//function for opening/closing the menu
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
//function for displaying/hiding the upload and delete btns & checkboxes in the menu
async function editmenuf() {
    const response = await fetch("/userroleraw");
    const data = await response.json();
    console.log(data);
    if (data == "notloggedin") {
        alert("You have been logged out. Please log in again to continue editing. Some changes may be lost.");
        return console.log("Not logged in");
    }
    if (data == "admin") {
        var x = document.getElementById("sidenavbtns");
        if (x.style.display === "none") {
            x.style.display = "block";
        }
        else {
            x.style.display = "none";
        }
        localStorage.setItem('user_manual_role', 'admin');
        const y = document.querySelectorAll('input[type="checkbox"]');
        y.forEach(y => {
            y.style.display = y.style.display === 'none' ? 'inline-block' : 'none';
        });
    }
    else {
        localStorage.setItem('user_manual_role', 'notadmin');
        const editbtn = document.getElementById('editbtn');
        editbtn.style.display = "none";
        return console.log("not admin");
    }
}
window.onload = editmenuf;
export {};
//# sourceMappingURL=menu.js.map