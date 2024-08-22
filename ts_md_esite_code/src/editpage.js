console.log("hello world! js");

//gets decompressed data from ts
async function decompdataf() {
  const response = await fetch("/decompressedtext");
  const data = await response.text();

  console.log('js decompdata ' + data);

  document.getElementById('contents').innerHTML = marked.parse(data);
}

//function for editing the markdown
async function editf(){
  const response = await fetch("/userroleraw");
  const data = await response.json();
  console.log(data);

  if (data == "admin") {
    var x = document.getElementById("editcontents");
    if (x.style.display === "none") {
      x.style.display = "block";
      var l = document.getElementById('contents').innerHTML;
      document.getElementById('text field').innerHTML = marked.parse(l);
    } else {
      x.style.display = "none";
    }
  } else {
    return console.log("Invalid role: " + data);
  }
}

//takes the contents of text field into outputFrame
function updateIframe() {
  var text = document.getElementById('text field').value;
  var iframe = document.getElementById('outputFrame');

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(marked.parse(text));
  iframe.contentWindow.document.close();
}

//sends the text to ts
function savechangesf(){
  var text = document.getElementById('text field').value;
  document.getElementById('contents').innerHTML = marked.parse(text);

  var content = document.getElementById('text field').value
  console.log(content)
 
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
