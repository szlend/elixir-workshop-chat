import "phoenix_html";
import {Socket} from "phoenix";

if (ENV.state === "chat") {
  let dom = {
    chat: document.querySelector("[data-role=chat-body]"),
    form: document.querySelector("[data-role=chat-form]"),
    input: document.querySelector("[data-role=chat-form-input]")
  };

  $(dom.form).on("submit", onSendMessage);

  let user = ENV.user;
  let room = ENV.room;

  let socket = new Socket("/socket", {params: {user: user}});
  socket.connect();

  let channel = socket.channel(`room:${room}`);
  channel.join()
    .receive("ok", onRoomJoin)
    .receive("error", onRoomJoinError);

  channel.on("message", onReceiveMessage);
  channel.on("join", onUserJoin);
  channel.on("leave", onUserLeave);

  function onRoomJoin() {
    appendSuccess(`*** Successfully connected to room "${room}" as user "${user}"`);
  }

  function onRoomJoinError() {
    appendError(`*** Could not join room "${room}" as user "${user}"`);
  }

  function onSendMessage(event) {
    let body = dom.input.value;
    channel.push("message", {body: body});

    event.preventDefault();
    dom.input.value = "";
  }

  function onReceiveMessage({user: user, body: body}) {
    appendMessage(user, body);
  }

  function onUserJoin({user: user}) {
    appendInfo(`*** User "${user}" joined room "${room}"`);
  }

  function onUserLeave({user: user}) {
    appendInfo(`*** User "${user}" left room "${room}"`);
  }

  function appendMessage(user, body) {
    $('<div>')
      .append([$('<b>').text(`${user}: `), body])
      .appendTo(dom.chat);
  }

  function appendSuccess(message) {
    $('<div class="text-success">')
      .text(message)
      .appendTo(dom.chat);
  }

  function appendInfo(message) {
    $('<div class="text-info">')
      .text(message)
      .appendTo(dom.chat);
  }

  function appendError(message) {
    $('<div class="text-danger">')
      .text(message)
      .appendTo(dom.chat);
  }
}
