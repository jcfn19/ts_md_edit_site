console.log("hello world! js");

declare const marked: any;

let markDownTemp = ""; // global variabel for holding markdown

//gets decompressed data from ts
async function decompdataf() {
  const response = await fetch("/decompressedtext");
  const data = await response.text();

  markDownTemp = data // lagrer markdown

  console.log('js decompdata ' + data);

  document.getElementById('contents').innerHTML = marked.parse(data);
}

const updatebutton = document.getElementById('updatebtn') as HTMLButtonElement;
updatebutton.onclick = decompdataf;

//function for editing the markdown
async function editf() {
  const response = await fetch("/userroleraw");
  const data = await response.json();
  console.log(data);

  if (data == "admin") {
    var x = document.getElementById("editcontents");
    if (x.style.display === "none") {
      x.style.display = "block";
      document.getElementById('text field').innerHTML = markDownTemp
    } else {
      x.style.display = "none";
    }
  } else {
    return console.log("Invalid role: " + data);
  }
}

const editbutton = document.getElementById('editbtn') as HTMLButtonElement;
editbutton.onclick = editf;

//takes the contents of text field into outputFrame
function updateIframe() {
  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  const text = textF.value;
  const iframe = document.getElementById('outputFrame') as HTMLIFrameElement;

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(marked.parse(text));
  iframe.contentWindow.document.close();
}

const previewbutton = document.getElementById('previewbtn') as HTMLButtonElement;
previewbutton.onclick = updateIframe;

//sends the text to ts
function savechangesf() {
  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  const text = textF.value;
  document.getElementById('contents').innerHTML = marked.parse(text);

  let contentv = document.getElementById('text field') as HTMLTextAreaElement;
  let content = contentv.value
  console.log(content);

  function sendjson() {
    const body = {
      brukerveiledning: content,
    }

    fetch("/sendjsonbody", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
  }

  sendjson();
}

const savecbutton = document.getElementById('savebtn') as HTMLButtonElement;
savecbutton.onclick = savechangesf;


const imgUploadForm = document.getElementById('imgUploadForm') as HTMLFormElement;
imgUploadForm.addEventListener('submit', function (e) {
  e.preventDefault();
  uploadImage(this)

})

async function uploadImage(form: HTMLFormElement) {

  const url = 'http://127.0.0.1:8000/uploadfile/'

  const formData = new FormData(form); // Collect form data

  try {
    const response = await fetch(url, {
      method: form.method, // Use the form's method
      body: formData, // Send as multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);

  }
  catch{
    console.log("Something")
  }

}