import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import Report from './pages/Report.jsx'
import CityDashboard from './pages/CityDashboard.jsx'
import SectorDashboards from './pages/SectorDashboards.jsx'
import LegalHelp from './pages/LegalHelp.jsx'
import Transparency from './pages/Transparency.jsx'
import Awareness from './pages/Awareness.jsx'
import Admin from './pages/Admin.jsx'
import './i18n.js'
import useFlushOffline from './hooks/useFlushOffline.js'
import axios from 'axios'

function getCookie(name){
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return parts.pop().split(';').shift()
	return null
}

axios.defaults.withCredentials = true
axios.interceptors.request.use((config)=>{
	const csrf = getCookie('XSRF-TOKEN')
	if (csrf) config.headers['X-CSRF-Token'] = csrf
	const token = localStorage.getItem('token')
	if (token) config.headers['Authorization'] = `Bearer ${token}`
	return config
})

function Layout() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-white shadow">
				<div className="container mx-auto px-4 py-3 flex justify-between items-center">
					<h1 className="text-xl font-bold">IACP</h1>
					<nav className="space-x-4 text-sm">
						<Link to="/">Home</Link>
						<Link to="/report">Report</Link>
						<Link to="/dashboard">Dashboard</Link>
						<Link to="/legal">Legal Help</Link>
						<Link to="/transparency">Tenders</Link>
						<Link to="/awareness">Awareness</Link>
						<Link to="/admin">Admin</Link>
						<Link to="/auth">Login/Register</Link>
					</nav>
				</div>
			</header>
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/report" element={<Report />} />
					<Route path="/dashboard" element={<CityDashboard />} />
					<Route path="/sectors" element={<SectorDashboards />} />
					<Route path="/legal" element={<LegalHelp />} />
					<Route path="/transparency" element={<Transparency />} />
					<Route path="/awareness" element={<Awareness />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/auth" element={<(await import('./pages/LoginRegister.jsx')).default />} />
				</Routes>
			</main>
			<footer className="bg-gray-100 text-center py-6 text-sm">
				<div className="container mx-auto px-4">Contact • Privacy • Disclaimer</div>
			</footer>
		</div>
	)
}

function AppWrapper(){
	useFlushOffline()
	useEffect(()=>{ axios.get('/api/csrf-token').catch(()=>{}) },[])
	return <Layout />
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<AppWrapper />
		</BrowserRouter>
	</React.StrictMode>
)