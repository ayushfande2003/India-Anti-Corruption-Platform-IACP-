import { useEffect, useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function CityDashboard() {
	const [city, setCity] = useState('Mumbai')
	const [data, setData] = useState({ categoryCounts: {}, byMonth: {}, points: [], topWards: [] })
	useEffect(() => {
		axios.get('/api/dashboards/city', { params: { city } }).then(r => setData(r.data))
	}, [city])
	const categoryData = Object.entries(data.categoryCounts).map(([name, value]) => ({ name, value }))
	const monthData = Object.entries(data.byMonth).map(([name, value]) => ({ name, value }))
	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="flex items-center gap-3">
				<label className="text-sm">City</label>
				<select className="border p-2" value={city} onChange={e => setCity(e.target.value)}>
					<option>Mumbai</option>
					<option>Delhi</option>
					<option>Pune</option>
					<option>Bengaluru</option>
					<option>Chennai</option>
				</select>
			</div>
			<div className="grid md:grid-cols-2 gap-6">
				<div className="h-96 border rounded">
					<MapContainer center={[19.076, 72.8777]} zoom={11} className="h-full w-full">
						<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
						{data.points.map((p, idx) => (
							<CircleMarker key={idx} center={[p.lat, p.lng]} radius={6} pathOptions={{ color: p.severity === 'HIGH' ? 'red' : p.severity === 'MEDIUM' ? 'orange' : 'green' }} />
						))}
					</MapContainer>
				</div>
				<div className="grid gap-6">
					<div className="h-48">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={70}>
									{categoryData.map((_, i) => (<Cell key={i} fill={["#0ea5e9","#10b981","#f59e0b","#ef4444","#6366f1","#14b8a6"][i%6]} />))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="h-48">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={monthData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Line type="monotone" dataKey="value" stroke="#0ea5e9" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	)
}