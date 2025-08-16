import { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'

function LocationPicker({ onPick }) {
	useMapEvents({
		click(e) {
			onPick([e.latlng.lat, e.latlng.lng])
		}
	})
	return null
}

export default function Report() {
	const [form, setForm] = useState({ category: 'others', description: '', dateTime: '', severity: 'MEDIUM', anonymous: false })
	const [pos, setPos] = useState([19.076, 72.8777])
	const [files, setFiles] = useState([])
	const [result, setResult] = useState(null)

	async function submit(e) {
		e.preventDefault()
		const data = new FormData()
		Object.entries({ ...form, latitude: pos[0], longitude: pos[1] }).forEach(([k,v]) => data.append(k, v))
		for (const f of files) data.append('evidence', f)
		try {
			const r = await axios.post('/api/reports', data)
			setResult(r.data)
		} catch (err) {
			if (!navigator.onLine) {
				const plain = { ...form, latitude: pos[0], longitude: pos[1] }
				const { enqueueRequest } = await import('../utils/offlineQueue.js')
				await enqueueRequest({ type: 'report', payload: plain })
				setResult({ id: 'offline', status: 'queued' })
			} else {
				alert('Failed to submit')
			}
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
			<form className="space-y-3" onSubmit={submit}>
				<div>
					<label className="block text-sm">Category</label>
					<select className="border p-2 w-full" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
						<option>medical</option>
						<option>police</option>
						<option>RTO</option>
						<option>municipal office</option>
						<option>education</option>
						<option>transport</option>
						<option>others</option>
					</select>
				</div>
				<div>
					<label className="block text-sm">Description</label>
					<textarea className="border p-2 w-full" rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
				</div>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="block text-sm">Date & Time</label>
						<input type="datetime-local" className="border p-2 w-full" value={form.dateTime} onChange={e => setForm({ ...form, dateTime: e.target.value })} />
					</div>
					<div>
						<label className="block text-sm">Severity</label>
						<select className="border p-2 w-full" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
							<option>LOW</option>
							<option>MEDIUM</option>
							<option>HIGH</option>
						</select>
					</div>
				</div>
				<div>
					<label className="block text-sm">Evidence (images/videos/docs)</label>
					<input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))} />
				</div>
				<label className="inline-flex items-center gap-2 text-sm">
					<input type="checkbox" checked={form.anonymous} onChange={e => setForm({ ...form, anonymous: e.target.checked })} /> Submit anonymously
				</label>
				<button className="px-4 py-2 bg-sky-600 text-white rounded">Submit</button>
				{result && <div className="text-sm text-green-700">Submitted. Tracking ID: {result.id}</div>}
			</form>
			<div className="h-96">
				<MapContainer center={pos} zoom={11} className="h-full w-full">
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Marker position={pos} />
					<LocationPicker onPick={(p) => setPos(p)} />
				</MapContainer>
				<div className="text-sm text-gray-600 mt-2">Lat: {pos[0].toFixed(4)}, Lng: {pos[1].toFixed(4)}</div>
			</div>
		</div>
	)
}