console.log("hello world! js");
let markDownTemp = ""; // global variabel for holding markdown
//gets decompressed data from ts
async function decompdataf() {
    const response = await fetch("/decompressedtext");
    const data = await response.text();
    markDownTemp = data; // lagrer markdown
    console.log('js decompdata ' + data);
    document.getElementById('contents').innerHTML = marked.parse(data);
}
const updatebutton = document.getElementById('updatebtn');
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
export {};
//# sourceMappingURL=editpage.js.map