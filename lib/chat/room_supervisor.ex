defmodule Chat.RoomSupervisor do
  use Supervisor
  alias Chat.RoomHistory

  # Client

  def start_link do
    Supervisor.start_link(__MODULE__, [], name: __MODULE__)
  end

  def find_or_start_child(room_name) do
    case Supervisor.start_child(__MODULE__, [room_name]) do
      {:ok, pid} -> pid
      {:error, {:already_started, pid}} -> pid
    end
  end

  # Server

  def init(_) do
    children = [
      worker(RoomHistory, [])
    ]

    supervise(children, strategy: :simple_one_for_one)
  end
end
