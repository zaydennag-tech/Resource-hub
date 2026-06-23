'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleReset(e) {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage(
        'Password reset email sent. Please check your inbox.'
      )
    }

    setLoading(false)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f9f9f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          border: '1px solid #ebebeb',
          borderRadius: '28px',
          padding: '48px'
        }}
      >
        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            marginBottom: '15px',
            textAlign: 'center'
          }}
        >
          Forgot Password
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '35px'
          }}
        >
          Enter your email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleReset}>
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '8px',
              marginBottom: '25px',
              borderRadius: '16px',
              border: '1px solid #e5e5e5'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '999px',
              background: '#111',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {loading
              ? 'Sending...'
              : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '20px',
              textAlign: 'center',
              color: '#666'
            }}
          >
            {message}
          </p>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: '30px'
          }}
        >
          <Link
            href="/signin"
            style={{
              color: '#2563eb'
            }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
