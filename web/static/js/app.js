import "phoenix_html";
import {Socket} from "phoenix";
import Chat from "./chat";

if (ENV.state === "chat") {
  let dom = {
    chat: document.querySelector("[data-role=chat-body]"),
    form: document.querySelector("[data-role=chat-form]"),
    input: document.querySelector("[data-role=chat-form-input]")
  };

  $(dom.form).on("submit", onSendMessage);

  let user = ENV.user;
  let room = ENV.room;
  let chat = new Chat(dom);

  // Create socket
  let socket = new Socket("/socket", {params: {user: user}});
  socket.connect();

  // Join channel
  let channel = socket.channel(`room:${room}`);
  channel.join()
    .receive("ok", onRoomJoin)
    .receive("error", onRoomJoinError);

  // Register channel receive events
  channel.on("message", onReceiveMessage);
  channel.on("history", onReceiveHistory);
  channel.on("join", onUserJoin);
  channel.on("leave", onUserLeave);

  function onRoomJoin() {
    chat.appendSuccess(`*** Successfully connected to room "${room}" as user "${user}"`);
  }

  function onRoomJoinError() {
    chat.appendError(`*** Could not join room "${room}" as user "${user}"`);
  }

  function onSendMessage(event) {
    let body = dom.input.value;

    // Send message to server
    channel.push("message", {body: body});

    event.preventDefault();
    dom.input.value = "";
  }

  function onReceiveMessage({user: user, body: body}) {
    chat.appendMessage(user, body);
  }

  function onReceiveHistory({messages: messages}) {
    messages.forEach(({user: user, body: body}) => {
      chat.appendMessage(user, body);
    });
  }

  function onUserJoin({user: user}) {
    chat.appendInfo(`*** User "${user}" joined room "${room}"`);
  }

  function onUserLeave({user: user}) {
    chat.appendInfo(`*** User "${user}" left room "${room}"`);
  }
}
