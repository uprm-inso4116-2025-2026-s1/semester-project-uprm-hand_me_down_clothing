'use client'

import React, { useState } from 'react'
import { verifyPhoneOtp } from '../auth'
import { useRouter } from 'next/navigation'

export default function PhoneVerifyPage() {
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    const { error } = await verifyPhoneOtp(phone, token)
    setLoading(false)
    if (error) setError(error.message || 'Verification failed or expired')
    else {
      setMessage('Phone verified and 2FA enabled for your account.')
      // redirect to home after a short delay
      setTimeout(() => router.push('/'), 1500)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Verify Phone OTP</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Phone number</label>
        <input
          type="tel"
          className="w-full p-2 border rounded mb-4"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <label className="block mb-2">OTP code</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={token}
          onChange={e => setToken(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  )
}
