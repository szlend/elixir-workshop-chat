export default class Chat {
  constructor(dom) {
    this.dom = dom;
  }

  appendMessage(user, body) {
    $('<div>')
      .append([$('<b>').text(`${user}: `), body])
      .appendTo(this.dom.chat);
  }

  appendSuccess(message) {
    $('<div class="text-success">')
      .text(message)
      .appendTo(this.dom.chat);
  }

  appendInfo(message) {
    $('<div class="text-info">')
      .text(message)
      .appendTo(this.dom.chat);
  }

  appendError(message) {
    $('<div class="text-danger">')
      .text(message)
      .appendTo(this.dom.chat);
  }
}
