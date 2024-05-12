const app = document.querySelector(".app");
const socket = io();
let uname;
document.getElementById("join_chat_btn").addEventListener("click", () => {
  let username = document.getElementById("name_inp").value;
  if (username.length == 0) {
    alert("Please choose the username to join the conversation");
    return;
  }
  socket.emit("newuser", username);
  document.getElementById("name_inp").value = "";
  uname = username;
  document.querySelector(".join-screen").classList.remove("active");
  document.querySelector(".chat-screen").classList.add("active");
});

document.getElementById("send_msg_btn").addEventListener("click", () => {
  let message = document.getElementById("send_inp_msg").value;
  if (message === "") {
    alert("Add some text message in a text box.");
    return;
  }
  if (message != "") {
    ShowMsg("my", {
      username: uname,
      text: message,
    });
    socket.emit("chat", {
      username: uname,
      text: message,
    });
    document.getElementById("send_inp_msg").value = "";
    document.getElementById("send_inp_msg").focus();
  }
});

document.getElementById("exit_btn").addEventListener("click", () => {
  socket.emit("exituser", uname);
  window.location.href = window.location.href;
});
socket.on("update", (udpate) => {
  ShowMsg("update", udpate);
});
socket.on("chat", (message) => {
  ShowMsg("other", message);
});

function ShowMsg(type, message) {
  let messageContainer = document.getElementById("message_box");
  if (type == "my") {
    let element = document.createElement("div");
    element.setAttribute("class", "message my-message");
    element.innerHTML = `
      <div>
        <div class="name">Me</div>
        <div class="text">${message.text}</div>
        </div>
        `;
    messageContainer.appendChild(element);
  } else if (type == "other") {
    let element = document.createElement("div");
    element.setAttribute("class", "message other-message");
    element.innerHTML = `
    <div>
        <div class="name">${message.username}</div>
        <div class="text">${message.text}</div>
    </div>`;
    messageContainer.appendChild(element);
  } else if (type == "update") {
    let element = document.createElement("div");
    element.setAttribute("class", "update");
    element.innerHTML = `<div>${message}</div>`;
    messageContainer.appendChild(element);
  }
}
