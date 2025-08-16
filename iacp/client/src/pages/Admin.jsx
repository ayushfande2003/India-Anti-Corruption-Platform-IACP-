import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Admin() {
	const [token, setToken] = useState('')
	const [pending, setPending] = useState([])
	async function load() {
		if (!token) return
		const r = await axios.get('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
		setPending(r.data)
	}
	useEffect(() => { load() }, [token])
	async function act(id, action) {
		await axios.post(`/api/admin/reports/${id}/${action}`, {}, { headers: { Authorization: `Bearer ${token}` } })
		load()
	}
	return (
		<div className="container mx-auto px-4 py-8 space-y-4">
			<div className="flex gap-2">
				<input className="border p-2 flex-1" placeholder="Admin JWT token" value={token} onChange={e => setToken(e.target.value)} />
				<button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={load}>Load Pending</button>
			</div>
			<ul className="space-y-2 text-sm">
				{pending.map(r => (
					<li key={r.id} className="border rounded p-2">
						<div className="font-medium">{r.category} • {new Date(r.dateTime).toLocaleString()}</div>
						<p className="text-gray-700">{r.description}</p>
						<div className="flex gap-2 mt-2">
							<button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={() => act(r.id, 'approve')}>Approve</button>
							<button className="px-3 py-1 bg-rose-600 text-white rounded" onClick={() => act(r.id, 'reject')}>Reject</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}