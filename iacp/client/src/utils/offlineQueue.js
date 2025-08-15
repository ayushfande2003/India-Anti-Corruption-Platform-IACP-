import { openDB } from 'idb'

const DB_NAME = 'iacp'
const STORE = 'queue'

async function db(){
	return openDB(DB_NAME, 1, { upgrade(db){ db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true }) } })
}

export async function enqueueRequest(req){
	const d = await db();
	await d.add(STORE, { ...req, ts: Date.now() })
}

export async function flushQueue(handler){
	const d = await db();
	const tx = d.transaction(STORE, 'readwrite')
	const all = await tx.store.getAll()
	for(const item of all){
		try{ await handler(item); await tx.store.delete(item.id) }catch(e){ /* keep for retry */ }
	}
	await tx.done
}

export function setupOnlineFlush(handler){
	window.addEventListener('online', ()=> flushQueue(handler))
}