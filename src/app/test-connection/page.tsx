'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>('loading')
  const [envCheck, setEnvCheck] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function checkConnection() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setEnvCheck({
        urlConfigured: !!url && url !== 'your-supabase-url',
        keyConfigured: !!key && key !== 'your-supabase-anon-key',
      })

      if (!url || url === 'your-supabase-url') {
        setStatus('Error: Supabase URL not configured.')
        return
      }

      try {
        const { error } = await supabase.from('vehicles').select('count').limit(1)
        if (error) throw error
        setStatus('Success: Connected to Supabase')
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = err instanceof Error ? err.message : (err as any)?.message || 'Unknown error'
        setStatus(`Connection failed: ${message}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Environment Config:</h2>
        <ul className="list-disc pl-5">
          <li className={envCheck.urlConfigured ? 'text-green-600' : 'text-red-600'}>
            URL: {envCheck.urlConfigured ? 'Configured' : 'Missing/Default'}
          </li>
          <li className={envCheck.keyConfigured ? 'text-green-600' : 'text-red-600'}>
            Anon Key: {envCheck.keyConfigured ? 'Configured' : 'Missing/Default'}
          </li>
        </ul>
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Connection Status:</h2>
        <p className={status.startsWith('Success') ? 'text-green-600 font-bold' : 'text-red-600'}>
          {status}
        </p>
      </div>
    </div>
  )
}
