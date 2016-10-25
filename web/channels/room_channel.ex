defmodule Chat.RoomChannel do
  use Chat.Web, :channel

  def join("room:" <> _room_name, _payload, socket) do
    send(self, :after_join)
    {:ok, socket}
  end

  def handle_in("message", %{"body" => body}, socket) do
    broadcast(socket, "message", %{user: socket.assigns.user, body: body})
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    broadcast_from(socket, "join", %{user: socket.assigns.user})
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    broadcast_from(socket, "leave", %{user: socket.assigns.user})
  end
end
