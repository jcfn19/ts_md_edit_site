console.log("hello world! js");

// remove the most common zerowidth characters from the start of the file
// marked.parse(
//   contents.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")
// );

document.getElementById('text field').innerHTML =
  marked.parse('# "Insert website name" User manual\n\nRendered by **marked**.');

async function bgetusers() {
    const response = await fetch("/usersrawjson");
    const data = await response.json();
    console.log(data);

    let testuser = data[0].uname;
    console.log(testuser);
    // hvis user som er logget inn sinn rolle er admin, tillat å edite siden
}

bgetusers()

function updateIframe() {
  var text = document.getElementById('text field').value;
  var iframe = document.getElementById('outputFrame');
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(text);
  iframe.contentWindow.document.close();
}