defmodule Chat.RoomHistory do
  use GenServer
  alias Chat.RoomSupervisor

  # Client

  def start_link(room_name) do
    state = %{name: room_name, messages: []}
    GenServer.start_link(__MODULE__, state, name: via_name(room_name))
  end

  def fetch_messages(room_name) do
    pid = RoomSupervisor.find_or_start_child(room_name)
    GenServer.call(pid, :fetch_messages)
  end

  def write_message(room_name, message) do
    pid = RoomSupervisor.find_or_start_child(room_name)
    GenServer.cast(pid, {:write_message, message})
  end

  def via_name(room_name) do
    {:via, :global, {:room, room_name}}
  end

  # Server

  def handle_call(:fetch_messages, _from, state) do
    {:reply, Enum.reverse(state.messages), state}
  end

  def handle_cast({:write_message, message}, state) do
    {:noreply, %{state | messages: [message | state.messages]}}
  end
end
