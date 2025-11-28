"use client"

import React, { useState } from 'react';
import { requestPasswordReset } from '../auth';

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { error } = await requestPasswordReset(email);
      if (error) {
        setError(error.message || 'Failed to send reset email.');
      } else {
        setMessage('Password reset email sent! Check your inbox (and spam folder).');
      }
    } catch (e: any) {
      setError((e && e.message) || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Email address</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>
      </form>
      {message && <div className="mt-4 text-green-600" role="status" aria-live="polite">{message}</div>}
      {error && <div className="mt-4 text-red-600" role="alert" aria-live="assertive">{error}</div>}
      <div className="mt-3 text-sm text-gray-600">
        If you don't receive an email within a few minutes, try checking your spam folder or request the reset again.
      </div>
    </div>
  );
}
