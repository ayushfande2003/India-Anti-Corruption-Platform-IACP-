import { useEffect, useState } from 'react'
import axios from 'axios'

export default function SectorDashboards() {
	const [sector, setSector] = useState('medical')
	const [data, setData] = useState({ total: 0, topLocations: [], resolutionRate: 0 })
	useEffect(() => { axios.get('/api/dashboards/sector', { params: { sector } }).then(r => setData(r.data)) }, [sector])
	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="flex items-center gap-3">
				<label className="text-sm">Sector</label>
				<select className="border p-2" value={sector} onChange={e => setSector(e.target.value)}>
					<option>medical</option>
					<option>police</option>
					<option>RTO</option>
					<option>municipal office</option>
					<option>education</option>
					<option>transport</option>
				</select>
			</div>
			<div className="grid md:grid-cols-2 gap-6">
				<div className="border rounded p-3">
					<h3 className="font-semibold">Stats</h3>
					<div className="text-sm">Total reports: {data.total}</div>
					<div className="text-sm">Resolution rate: {Math.round(data.resolutionRate*100)}%</div>
				</div>
				<div className="border rounded p-3">
					<h3 className="font-semibold">Top locations</h3>
					<ul className="list-disc pl-5 text-sm">
						{data.topLocations.map(([name, count], idx) => (<li key={idx}>{name}: {count}</li>))}
					</ul>
				</div>
			</div>
		</div>
	)
}