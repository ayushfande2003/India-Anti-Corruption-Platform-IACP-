import { useState } from 'react'
import axios from 'axios'

export default function LoginRegister(){
	const [mode, setMode] = useState('login')
	const [form, setForm] = useState({ name: '', email: '', password: '' })
	const [user, setUser] = useState(null)

	async function submit(e){
		e.preventDefault()
		if(mode==='register'){
			const r = await axios.post('/api/auth/register', form)
			localStorage.setItem('token', r.data.token)
			setUser(r.data.user)
		}else{
			const r = await axios.post('/api/auth/login', { email: form.email, password: form.password })
			localStorage.setItem('token', r.data.token)
			setUser(r.data.user)
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-4">
			<div className="flex gap-3">
				<button className={`px-3 py-1 rounded ${mode==='login'?'bg-sky-600 text-white':'bg-gray-200'}`} onClick={()=>setMode('login')}>Login</button>
				<button className={`px-3 py-1 rounded ${mode==='register'?'bg-sky-600 text-white':'bg-gray-200'}`} onClick={()=>setMode('register')}>Register</button>
			</div>
			<form className="space-y-3" onSubmit={submit}>
				{mode==='register' && <input className="border p-2 w-full" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />}
				<input className="border p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
				<input type="password" className="border p-2 w-full" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
				<button className="px-4 py-2 bg-sky-600 text-white rounded">{mode==='login'?'Login':'Create account'}</button>
			</form>
			{user && <div className="text-sm">Welcome {user.name} ({user.role})</div>}
		</div>
	)
}