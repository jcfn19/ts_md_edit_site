console.log("hello world! js");

const devServerUrlPublic = "http://localhost:3000/";
const imageFolderName = "uploaded_images"

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
imgUploadForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const imageUrl = await uploadImage(this);
  const imgFilename = document.getElementById('imgFilename') as HTMLDivElement
  imgFilename.innerText = "Image uploaded successfully: \n" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl;

  //add to text field

  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  const text = textF.value;
  textF.value = text + "\n" + "![Image](" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl + ")";




})

async function uploadImage(form: HTMLFormElement): Promise<string> {

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
    return result.filename

  }
  catch{
    console.log("Something")
    return "file upload failed"
  }

}


//changes the size of the text field to fit the content

const textarea = document.getElementById('text field');

textarea.addEventListener('input', () => {
  // Reset height to auto to allow shrinking
  textarea.style.height = 'auto';
  // Set height to match the scroll height
  textarea.style.height = textarea.scrollHeight + 'px';
});

//changes the size of the iframe to fit the content

const iframe = document.getElementById('outputFrame') as HTMLIFrameElement;

iframe.addEventListener('load', () => {
  // Reset height to auto to allow shrinking
  iframe.style.height = 'auto';
  // Set height to match the scroll height
  iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
});