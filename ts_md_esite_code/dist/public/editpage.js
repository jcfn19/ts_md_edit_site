console.log("hello world! js");
const devServerUrlPublic = "http://localhost:3000/";
const imageFolderName = "uploaded_images";
let markDownTemp = ""; // global variabel for holding markdown
//gets decompressed data from server
async function decompdataf() {
    const response = await fetch("/decompressedtext");
    const data = await response.text();
    markDownTemp = data; // lagrer markdown
    console.log('js decompdata ' + data);
    document.getElementById('contents').innerHTML = marked.parse(data);
}
const updatebutton = document.getElementById('updatebtn');
updatebutton.onclick = decompdataf;
let datetemp = "";
//gets date from server
async function lasteditedf() {
    const response = await fetch("/lasteditedtext");
    const data = await response.text();
    datetemp = data;
    console.log("last modeified " + datetemp);
    document.getElementById('pagelastm').innerHTML = "this page was last modeified on " + datetemp;
}
lasteditedf();
//function for editing the markdown
async function editf() {
    const response = await fetch("/userroleraw");
    const data = await response.json();
    console.log(data);
    if (data == "admin") {
        var x = document.getElementById("editcontents");
        if (x.style.display === "none") {
            x.style.display = "block";
            document.getElementById('text field').innerHTML = markDownTemp;
        }
        else {
            x.style.display = "none";
        }
    }
    else {
        return console.log("Invalid role: " + data);
    }
}
const editbutton = document.getElementById('editbtn');
editbutton.onclick = editf;
//takes the contents of text field into outputFrame
function updateIframe() {
    const textF = document.getElementById('text field');
    const text = textF.value;
    const iframe = document.getElementById('outputFrame');
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(marked.parse(text));
    iframe.contentWindow.document.close();
}
const previewbutton = document.getElementById('previewbtn');
previewbutton.onclick = updateIframe;
function darkmodef() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
const darkmodebutton = document.getElementById('darkmodebtn');
darkmodebutton.onclick = darkmodef;
//sends the text to ts
function savechangesf() {
    const textF = document.getElementById('text field');
    const text = textF.value;
    document.getElementById('contents').innerHTML = marked.parse(text);
    let contentv = document.getElementById('text field');
    let content = contentv.value;
    console.log(content);
    function sendjson() {
        const body = {
            brukerveiledning: content,
        };
        fetch("/sendjsonbody", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }
    sendjson();
}
const savecbutton = document.getElementById('savebtn');
savecbutton.onclick = savechangesf;
//prints the contents of the page
function printcontentsf(contents) {
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
const printbutton = document.getElementById('printbtn');
printbutton.onclick = () => printcontentsf('contents');
const imgUploadForm = document.getElementById('imgUploadForm');
imgUploadForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const imageUrl = await uploadImage(this);
    const imgFilename = document.getElementById('imgFilename');
    imgFilename.innerText = "Image uploaded successfully: \n" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl;
    //add to text field
    const textF = document.getElementById('text field');
    const text = textF.value;
    textF.value = text + "\n" + "![Image](" + devServerUrlPublic + "/" + imageFolderName + "/" + imageUrl + ")";
});
async function uploadImage(form) {
    const url = 'http://127.0.0.1:8000/uploadfile/';
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
        return result.filename;
    }
    catch {
        console.log("Something");
        return "file upload failed";
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
const iframe = document.getElementById('outputFrame');
iframe.addEventListener('load', () => {
    // Reset height to auto to allow shrinking
    iframe.style.height = 'auto';
    // Set height to match the scroll height
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + 'px';
});
export {};
//# sourceMappingURL=editpage.js.map