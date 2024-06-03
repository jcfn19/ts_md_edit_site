console.log("hello world! js");

// remove the most common zerowidth characters from the start of the file
// marked.parse(
//   contents.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
// );

// let textfield = document.getElementById('text field').value

// document.getElementById('text field').innerHTML =
// marked.parse('# Marked in the browser\n\nRendered by **marked**.');

async function bgetusers() {
  const response = await fetch("/usersrawjson");
  const data = await response.json();
  console.log(data);

  let testuser = data[0].uname;
  console.log(testuser);
  // hvis user som er logget inn sinn rolle er admin, tillat å edite siden
}

bgetusers()

function editf(){
  var x = document.getElementById("editcontents");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
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