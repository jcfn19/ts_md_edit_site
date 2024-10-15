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

    if (data == "admin") {
        var x = document.getElementById("sidenavbtns");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
        const y = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        y.forEach(y => {
            y.style.display = y.style.display === 'none' ? 'inline-block' : 'none';
        });
    } else {
        return console.log("Invalid role: " + data);
    }
}

const editbutton = document.getElementById('editmenubtn') as HTMLButtonElement; 
editbutton.onclick = editmenuf;

// function for sending file to server.ts
function uploadnewfilef() {
    const contentElement = document.getElementById('cnfbtn') //some element in the html with text content
    // const filopplastning = contentElement.innerText; //get the text content of the element

    const body = {
        filopplastning: 'Hello world' + contentElement.innerText,
    };

    // send the data
    sendData();
  
    // function to send the data
    async function sendData() {

        // send the data to the server
        const response = await fetch('/sendfilebody', {
         method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body), //stringify the body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok'); 
        }

        // get the response from the server
        const filopplastning = await response.text();
        console.log(filopplastning);
    }


    // let contentf = document.querySelector('formcnf') as HTMLFormElement;
    // if (!contentf) return;
    // // contentf.addEventListener('submit', sendnewfile);

    // // contentf = event.currentTarget;

    // const body = {
    //     filopplastning: contentf,
    // }

    // function sendnewfile() {
    //     event.preventDefault();
    //     fetch("/sendfilebody", {
    //         method: 'POST',
    //         body: new FormData(contentf)
    //     });
    // }

    // sendnewfile();
}

const uploadnfbutton = document.getElementById('unfbtn') as HTMLButtonElement;
uploadnfbutton.onclick = uploadnewfilef;