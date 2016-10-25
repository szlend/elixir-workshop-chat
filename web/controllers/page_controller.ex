defmodule Chat.PageController do
  use Chat.Web, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def join(conn, %{"chat" => %{"room" => room, "user" => user}}) do
    redirect(conn, to: page_path(conn, :chat, room, user))
  end

  def chat(conn, %{"room" => room, "user" => user}) do
    render(conn, "chat.html", room: room, user: user)
  end
end
