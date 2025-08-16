import { useEffect } from 'react'
import axios from 'axios'
import { flushQueue, setupOnlineFlush } from '../utils/offlineQueue.js'

export default function useFlushOffline(){
	useEffect(() => {
		const handler = async (item) => {
			if (item.type === 'report') {
				await axios.post('/api/reports', item.payload)
			}
		}
		flushQueue(handler)
		setupOnlineFlush(handler)
	}, [])
}