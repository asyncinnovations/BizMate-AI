export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">Users</div>
        <div className="bg-white p-4 rounded shadow">Revenue</div>
        <div className="bg-white p-4 rounded shadow">AI Usage</div>
        <div className="bg-white p-4 rounded shadow">Alerts</div>
      </div>
    </div>
  )
}