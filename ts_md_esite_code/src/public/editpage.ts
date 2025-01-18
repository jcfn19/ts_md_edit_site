

const devServerUrlPublic = "http://localhost:3000/";
const imageFolderName = "uploaded_images"

declare const marked: any;

let currentMarkdownDocument = ""; // global variabel for holding markdown
let currentFileName = ""; // global variabel for holding filename

// gets decompressed data from server
// this is a test function, we should be able to load any file from the server
async function decompdataf() {
  const response = await fetch("/decompressedtext");
  const data = await response.text();

  currentMarkdownDocument = data // lagrer markdown

  console.log('js decompdata ' + data);

  document.getElementById('contents').innerHTML = marked.parse(data);
}

const newDocumentBtn = document.getElementById('newDocumentBtn') as HTMLButtonElement;
newDocumentBtn.onclick = createNewDocument;

function createNewDocument() {

  const ok = confirm("Do you want to create a new document? Any unsaved changes will be lost.");

  if (!ok) return;

  currentMarkdownDocument = "";
  currentFileName = "";
  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  textF.value = "";
  document.getElementById('contents').innerHTML = "";
  updatePreviewFrame();
}

//loads the markdown from the server
async function loadMarkDownFromDB(filename: string) {
  const url = './loadfile/' + filename;
  const response = await fetch(url);


  //Remember that any current editing by an admin will be lost
  if (false && localStorage.getItem('user_manual_role') == 'admin') {
    const dontCancel = confirm("You are about to load a new file. Any unsaved changes will be lost. Do you want to continue?");
    if (!dontCancel) return;
  }

  const contentElement = document.getElementById('contents');
    
  currentMarkdownDocument = await response.json()
  
  currentFileName = filename
  contentElement.innerHTML = marked.parse(currentMarkdownDocument);
}

//makes a new file or updates an existing file
async function saveMarkDownToDB(filename: string, content: string) {

  if (!filename || filename === "") {
    throw new Error('Filename is required');
  }

  const url = './savefile/' + filename;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: content
    })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  console.log('File saved successfully');
}





// const updatebutton = document.getElementById('updatebtn') as HTMLButtonElement;
// updatebutton.onclick = decompdataf;

let datetemp = "";

//gets date from server
async function lasteditedf() {
  const response = await fetch("/lasteditedtext");
  const data = await response.text();

  datetemp = data;

  console.log("last modeified " + datetemp);

  document.getElementById('pagelastm').innerHTML = "this page was last modeified on " + datetemp;
}



//function for editing the markdown
async function editf() {
  const response = await fetch("/userroleraw");
  const data = await response.json();
  console.log(data);

  if (data == "notloggedin") {
    alert("You have been logged out. Please log in again to continue editing. Some changes may be lost.");
  }

  if (data == "admin") {
    const editor = document.getElementById("editcontents");
    const contents = document.getElementById('contents')

    if (editor.style.display === "none") {
      editor.style.display = "block";

      contents.style.display = "none";

      document.getElementById('text field').innerHTML = currentMarkdownDocument
      
    } else {
      editor.style.display = "none";
      contents.style.display = "block";

      contents.innerHTML = marked.parse(currentMarkdownDocument);

    }

    updatePreviewFrame();
  } else {
    return console.log("Invalid role: " + data);
  }
}

const editbutton = document.getElementById('editbtn') as HTMLButtonElement;
editbutton.onclick = editf;

//takes the contents of text field into outputFrame
function updatePreviewFrame() {

  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  const text = textF.value;

  try {
    const parsedText = marked.parse(text);
    currentMarkdownDocument = text;
    const outputFrame = document.getElementById('outputFrame') as HTMLDivElement;
    outputFrame.innerHTML = parsedText;
  } catch (error) {
    //if the markdown is invalid, we do not want to load it into the current document
    console.log("Invalid markdown")
  }

  
}


function darkmodef() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

const darkmodebutton = document.getElementById('darkmodebtn') as HTMLButtonElement;
darkmodebutton.onclick = darkmodef;

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

const savebutton = document.getElementById('savebtn') as HTMLButtonElement;
savebutton.onclick = saveCurrentDocument;

async function saveCurrentDocument() {
  
  //make sure the preview is up to date
  updatePreviewFrame()

  let fileName = currentFileName

  fileName =  (!fileName || fileName === "") ? prompt("Please enter a filename", "filename") : fileName;
  
  try {
    await saveMarkDownToDB(fileName, currentMarkdownDocument);
    currentFileName = fileName;
  } catch (error) {
    console.error('Failed to save file:', error);
  }
}


//prints the contents of the page
function printcontentsf(contents: string) {
  const contentElement = document.getElementById(contents);
  if (!contentElement) {
    console.error(`Element with id ${contents} not found.`);
    return;
  }
  const content = contentElement.innerHTML;

  const printWindow = window.open('', '', 'height=600,width=800');

  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');

  printWindow.document.close();

  printWindow.print();
}

const printbutton = document.getElementById('printbtn') as HTMLButtonElement;
printbutton.onclick = () => printcontentsf('contents');

const imgUploadForm = document.getElementById('imgUploadForm') as HTMLFormElement;
imgUploadForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!this.file.files.length) {
    alert('Please select a file to upload');
    return;
  }

  //if the files is more that 500kb, we do not want to upload it

  if (this.file.files[0].size > 500000) {
    alert('File is too large. Maximum size is 500kb');
    return;
  }



  const imageUrl = await uploadImage(this);
  const imgFilename = document.getElementById('imgFilename') as HTMLDivElement
  imgFilename.innerText = "Image uploaded successfully: \n" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl;

  //add to text field

  const textF = document.getElementById('text field') as HTMLTextAreaElement;
  const text = textF.value;
  textF.value = text + "\n" + "![Image](" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl + ")";

  updatePreviewFrame()

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
  catch {
    console.log("Something")
    return "file upload failed"
  }

}

//changes the size of the text field to fit the content

const textarea = document.getElementById('text field') as HTMLTextAreaElement;

textarea.addEventListener('input', () => {
  // Reset height to auto to allow shrinking
  textarea.style.height = 'auto';
  // Set height to match the scroll height
  textarea.style.height = textarea.scrollHeight + 'px';

  updatePreviewFrame()

});

//changes the size of the iframe to fit the content

const iframe = document.getElementById('outputFrame') as HTMLIFrameElement;

iframe.addEventListener('load', () => {
  // Reset height to auto to allow shrinking
  iframe.style.height = 'auto';
  // Set height to match the scroll height
  iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
});


async function loadAndDisplayCurrentFilesInNavn(){

  const documentList = document.getElementById('documentList') as HTMLDivElement;

  const url = './allfilenames';

  const response = await fetch(url);

  const data = await response.json();

  data.forEach((filename: string) => {
    const listItem = document.createElement('li');
    listItem.innerText = filename;
    listItem.className = 'documentListItem';
    listItem.onclick = async () => {
      await loadMarkDownFromDB(filename);
    }
    documentList.appendChild(listItem);
  });






}



await loadAndDisplayCurrentFilesInNavn()
await lasteditedf();

try {
  await loadMarkDownFromDB("Velkommen");
} catch (error) {
  alert('Vi fant ikke velkomstfilen. Lag en som med filnavn "Velkommen"');  
}




