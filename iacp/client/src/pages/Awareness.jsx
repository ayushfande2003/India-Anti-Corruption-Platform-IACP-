import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Awareness() {
	const [vol, setVol] = useState({ name: '', email: '', city: '' })
	const [events, setEvents] = useState([])
	useEffect(() => { axios.get('/api/legal/events').then(r => setEvents(r.data)) }, [])
	return (
		<div className="container mx-auto px-4 py-8 space-y-6">
			<section>
				<h3 className="text-lg font-semibold mb-2">Micro-courses</h3>
				<ul className="list-disc pl-5 text-sm">
					<li>Citizen rights under RTI</li>
					<li>How to document corruption incidents</li>
					<li>Whistleblower protection basics</li>
				</ul>
			</section>
			<section>
				<h3 className="text-lg font-semibold mb-2">Quick Quiz</h3>
				<p className="text-sm text-gray-600">(Coming soon)</p>
			</section>
			<section>
				<h3 className="text-lg font-semibold mb-2">Volunteer Registration</h3>
				<div className="grid md:grid-cols-3 gap-3">
					<input className="border p-2" placeholder="Name" value={vol.name} onChange={e => setVol({ ...vol, name: e.target.value })} />
					<input className="border p-2" placeholder="Email" value={vol.email} onChange={e => setVol({ ...vol, email: e.target.value })} />
					<input className="border p-2" placeholder="City" value={vol.city} onChange={e => setVol({ ...vol, city: e.target.value })} />
				</div>
				<button className="px-4 py-2 bg-purple-600 text-white rounded mt-2">Join Network</button>
			</section>
			<section>
				<h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
				<ul className="list-disc pl-5 text-sm">
					{events.map(ev => (<li key={ev.id}>{ev.title} • {new Date(ev.date).toLocaleDateString()} • {ev.location}</li>))}
				</ul>
			</section>
		</div>
	)
}