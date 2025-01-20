//function for opening/closing the menu
function openNavf(): void {
    const sidenav = document.getElementById("idSidenav") as HTMLElement;
    sidenav.style.width = "250px";
}

const opennavbutton = document.getElementById('openNav') as HTMLSpanElement; 
opennavbutton.onclick = openNavf;
  
function closeNavf(): void {
    const sidenav = document.getElementById("idSidenav") as HTMLElement;
    sidenav.style.width = "0";
}

const closenavbutton = document.getElementById('closeNav') as HTMLButtonElement; 
closenavbutton.onclick = closeNavf;

//function for displaying/hiding the upload and delete btns & checkboxes in the menu
async function editmenuf(){
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
        } else {
            x.style.display = "none";
        }

        localStorage.setItem('user_manual_role', 'admin');

        const y = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        y.forEach(y => {
            y.style.display = y.style.display === 'none' ? 'inline-block' : 'none';
        });
    } else {
        localStorage.setItem('user_manual_role', 'notadmin');
        alert("You do not have the required permissions to edit this page, or you may have been logged out. Please log in again to continue editing.");
        return console.log("Invalid role: " + data);
    }
}

window.onload = editmenuf;
