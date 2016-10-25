import {Socket} from "phoenix"

export default class Chat {
  constructor(name, {elements: elements}) {
    this.name = name;
    this.dom = elements;
    this.socket = new Socket("/socket", {params: {name: name}});
    this.rooms = [];
  }

  start() {
    this.socket.connect();
  }
}
