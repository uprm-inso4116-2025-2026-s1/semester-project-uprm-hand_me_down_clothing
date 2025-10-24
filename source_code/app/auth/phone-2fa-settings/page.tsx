'use client'

import React, { useEffect, useState } from 'react'
import { signInWithPhone } from '../auth'
import { supabase } from '../supabaseClient'

export default function Phone2FASettings() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      const user = (data && (data.user as any)) || null
      if (user && user.user_metadata && user.user_metadata.phone) {
        setPhone(user.user_metadata.phone)
        setStatus(user.user_metadata.phone_2fa === 'enabled' ? 'enabled' : 'disabled')
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleSend = async () => {
    setLoading(true)
    setError(null)
    const { error } = await signInWithPhone(phone)
    setLoading(false)
    if (error) setError(error.message || 'Failed to send verification OTP')
    else setStatus('verification_sent')
  }

  const handleDisable = async () => {
    setLoading(true)
    setError(null)
    try {
      await supabase.auth.updateUser({ data: { phone_2fa: 'disabled' } })
      setStatus('disabled')
    } catch (e: any) {
      setError(e?.message || 'Failed to disable 2FA')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Phone 2FA Settings</h2>
      <div className="mb-4">
        <label className="block mb-2">Phone number</label>
        <input
          type="tel"
          className="w-full p-2 border rounded mb-2"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="+17891234567"
        />
        <div className="text-sm text-gray-600 mb-2">Status: {status || 'unknown'}</div>
        <div className="flex gap-2">
          <button onClick={handleSend} className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading}>
            {loading ? 'Sending...' : 'Send verification OTP'}
          </button>
          <button onClick={handleDisable} className="bg-red-600 text-white px-3 py-1 rounded" disabled={loading}>
            Disable 2FA
          </button>
        </div>
      </div>
      {status === 'verification_sent' && (
        <div className="mt-4 text-sm">OTP sent — go to <a href="/auth/phone-verify" className="text-blue-600 underline">Phone Verify</a> to enter the code.</div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  )
}
