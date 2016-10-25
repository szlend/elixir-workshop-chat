defmodule Chat.RoomChannel do
  use Chat.Web, :channel
  alias Chat.RoomHistory

  def join("room:" <> room_name, _payload, socket) do
    send(self, :after_join)
    {:ok, assign(socket, :room, room_name)}
  end

  def handle_in("message", %{"body" => body}, socket) do
    user = socket.assigns.user
    room = socket.assigns.room
    message = %{user: user, body: body}

    RoomHistory.write_message(room, message)
    broadcast(socket, "message", message)

    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    user = socket.assigns.user
    room = socket.assigns.room
    messages = RoomHistory.fetch_messages(room)

    broadcast_from(socket, "join", %{user: user})
    push(socket, "history", %{messages: messages})

    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    broadcast_from(socket, "leave", %{user: socket.assigns.user})
  end
end
