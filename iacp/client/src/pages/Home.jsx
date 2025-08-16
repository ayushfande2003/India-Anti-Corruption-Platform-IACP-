import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
	const [news, setNews] = useState([])
	useEffect(() => {
		axios.get('/api/news').then(r => setNews(r.data)).catch(() => setNews([]))
	}, [])
	return (
		<div className="container mx-auto px-4 py-8 space-y-8">
			<section className="text-center space-y-3">
				<h2 className="text-3xl font-bold">India Anti-Corruption Platform</h2>
				<p className="text-gray-600">Report, visualize, and combat corruption with data-driven transparency.</p>
				<div className="flex flex-wrap justify-center gap-3 mt-4">
					<Link to="/report" className="px-4 py-2 bg-sky-600 text-white rounded">Report Corruption</Link>
					<Link to="/dashboard" className="px-4 py-2 bg-emerald-600 text-white rounded">View Dashboards</Link>
					<Link to="/legal" className="px-4 py-2 bg-indigo-600 text-white rounded">Access Legal Help</Link>
					<Link to="/transparency" className="px-4 py-2 bg-orange-600 text-white rounded">Transparency Reports</Link>
					<Link to="/awareness" className="px-4 py-2 bg-purple-600 text-white rounded">Join Volunteers</Link>
				</div>
			</section>
			<section>
				<h3 className="text-xl font-semibold mb-3">Latest corruption-related news</h3>
				<div className="grid md:grid-cols-2 gap-4">
					{news.map((n, idx) => (
						<a key={idx} href={n.url} target="_blank" rel="noreferrer" className="border rounded p-3 hover:bg-gray-50">
							<div className="font-medium">{n.title}</div>
							<div className="text-sm text-gray-600">{n.source} • {new Date(n.publishedAt).toLocaleString()}</div>
							<p className="text-sm mt-1">{n.description}</p>
						</a>
					))}
				</div>
			</section>
		</div>
	)
}