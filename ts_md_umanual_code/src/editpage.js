console.log("hello world! js");

async function editf(){
  const response = await fetch("/userroleraw");
  const data = await response.json();
  console.log(data);

  if (data == "admin") {
    var x = document.getElementById("editcontents");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } else {
    return console.log("Invalid role: " + data);
  }
}

function updateIframe() {
  var text = document.getElementById('text field').value;
  var iframe = document.getElementById('outputFrame');

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(marked.parse(text));
  iframe.contentWindow.document.close();
}

function savechangesf(){
  var text = document.getElementById('text field').value;
  document.getElementById('contents').innerHTML = marked.parse(text);
}