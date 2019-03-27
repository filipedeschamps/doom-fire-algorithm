defmodule LiveDoomFireWeb.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build common datastructures and query the data layer.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences for testing with connections
      use Phoenix.ConnTest
      import LiveDoomFireWeb.Router.Helpers

      # The default endpoint for testing
      @endpoint LiveDoomFireWeb.Endpoint
    end
  end


  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(LiveDoomFire.Repo)
    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(LiveDoomFire.Repo, {:shared, self()})
    end
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

end
