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