console.log("hello world! js");

const response = fetch("/usersrawjson");
const data = response.json();
console.log(data);

let testfeedback = data[0].afeedbackm;
console.log(testfeedback);