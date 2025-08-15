import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Transparency() {
	const [q, setQ] = useState('')
	const [department, setDepartment] = useState('')
	const [min, setMin] = useState('')
	const [max, setMax] = useState('')
	const [tenders, setTenders] = useState([])
	const [anomalies, setAnomalies] = useState([])

	async function search() {
		const r = await axios.get('/api/transparency/tenders', { params: { q, department, min, max } })
		setTenders(r.data)
	}
	useEffect(() => { axios.get('/api/transparency/anomalies').then(r => setAnomalies(r.data.suspicious)) }, [])

	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<div className="grid md:grid-cols-4 gap-3">
				<input className="border p-2" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
				<input className="border p-2" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} />
				<input className="border p-2" placeholder="Min Amount" value={min} onChange={e => setMin(e.target.value)} />
				<input className="border p-2" placeholder="Max Amount" value={max} onChange={e => setMax(e.target.value)} />
			</div>
			<button className="px-4 py-2 bg-sky-600 text-white rounded" onClick={search}>Search</button>
			<div>
				<h3 className="font-semibold mb-2">Tenders & Budgets</h3>
				<table className="w-full text-sm">
					<thead><tr className="text-left"><th>Dept</th><th>Title</th><th>Amount</th><th>Status</th></tr></thead>
					<tbody>
						{tenders.map(t => (<tr key={t.id}><td>{t.department}</td><td>{t.title}</td><td>₹{t.amount}</td><td>{t.status}</td></tr>))}
					</tbody>
				</table>
			</div>
			<div>
				<h3 className="font-semibold mb-2">Suspicious Contracts</h3>
				<ul className="list-disc pl-5 text-sm">
					{anomalies.map(a => (<li key={a.id}>{a.department} • {a.title} • ₹{a.amount}</li>))}
				</ul>
			</div>
		</div>
	)
}