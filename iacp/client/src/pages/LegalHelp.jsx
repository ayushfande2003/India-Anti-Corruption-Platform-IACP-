import { useState } from 'react'
import axios from 'axios'

export default function LegalHelp() {
	const [form, setForm] = useState({ applicantName: '', address: '', infoSought: '', department: '', city: '' })
	const [rti, setRti] = useState('')
	const [city, setCity] = useState('Mumbai')
	const [lawyers, setLawyers] = useState([])

	async function generate() {
		const r = await axios.post('/api/legal/rti-generate', form)
		setRti(r.data.content)
	}

	async function loadLawyers() {
		const r = await axios.get('/api/legal/lawyers', { params: { city } })
		setLawyers(r.data)
	}

	return (
		<div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
			<div className="space-y-3">
				<h3 className="text-lg font-semibold">RTI Request Generator</h3>
				<input className="border p-2 w-full" placeholder="Applicant name" value={form.applicantName} onChange={e => setForm({ ...form, applicantName: e.target.value })} />
				<input className="border p-2 w-full" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
				<input className="border p-2 w-full" placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
				<input className="border p-2 w-full" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
				<textarea className="border p-2 w-full" rows={6} placeholder="Information sought" value={form.infoSought} onChange={e => setForm({ ...form, infoSought: e.target.value })}></textarea>
				<button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={generate}>Generate</button>
				{rti && (<textarea className="border p-2 w-full" rows={10} value={rti} readOnly></textarea>)}
			</div>
			<div>
				<h3 className="text-lg font-semibold mb-2">Lawyer Contacts</h3>
				<div className="flex gap-2 mb-2">
					<input className="border p-2" value={city} onChange={e => setCity(e.target.value)} />
					<button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={loadLawyers}>Search</button>
				</div>
				<ul className="space-y-2 text-sm">
					{lawyers.map(l => (<li key={l.id} className="border rounded p-2"><div className="font-medium">{l.name}</div><div>{l.city}</div><div>{l.contactInfo}</div><div>{l.specialization}</div></li>))}
				</ul>
			</div>
		</div>
	)
}