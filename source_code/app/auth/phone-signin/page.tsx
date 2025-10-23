'use client'

import React, { useState } from 'react'
import { signInWithPhone } from '../auth'

export default function PhoneSignInPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)
    const { error } = await signInWithPhone(phone)
    setLoading(false)
    if (error) setError(error.message || 'Failed to send OTP')
    else setMessage('OTP sent! Check your phone and enter the code on the verification page.')
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign in with Phone</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Phone number (E.164 format, e.g. +17891234567)</label>
        <input
          type="tel"
          className="w-full p-2 border rounded mb-4"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      <div className="mt-4 text-sm">
        After receiving the OTP, go to the <a className="text-blue-600 underline" href="/auth/phone-verify">Phone Verify</a> page to enter it.
      </div>
    </div>
  )
}
