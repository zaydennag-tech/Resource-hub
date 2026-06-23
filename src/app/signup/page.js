'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function SignUpPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setMessage(error.message)
      setSuccess(false)
    } else {
      setMessage('Account created! Redirecting to sign in...')
      setSuccess(true)
      setTimeout(() => router.push('/signin'), 2000)
    }

    setLoading(false)
  }

  async function googleSignup() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
    background: '#fafafa',
    fontSize: '14px',
    outline: 'none',
    color: '#111',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '6px',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f5f5f3',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: 'inherit',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '24px',
        padding: '40px',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '32px', height: '32px', background: '#111',
            borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Tutorverse</span>
        </div>

        <div style={{ width: '40px', height: '2px', background: '#e8e8e8', margin: '0 auto 1.75rem', borderRadius: '2px' }} />

        <h1 style={{ fontSize: '1.4rem', fontWeight: '600', textAlign: 'center', marginBottom: '6px', color: '#111' }}>
          Create an account
        </h1>
        <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '2rem' }}>
          Join Tutorverse and start sharing educational resources
        </p>

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '999px',
              border: 'none',
              background: '#111',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
          <span style={{ fontSize: '12px', color: '#aaa' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
        </div>

        {/* Google */}
        <button
          onClick={googleSignup}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '999px',
            border: '1px solid #e5e5e5',
            background: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.017 17.64 11.71 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {message && (
          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '13px',
            color: success ? '#16a34a' : '#ef4444',
            background: success ? '#f0fdf4' : '#fef2f2',
            padding: '10px',
            borderRadius: '10px',
          }}>
            {message}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: '#888' }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: '#111', fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid #ddd' }}>
            Sign in
          </Link>
        </div>

      </div>
    </main>
  )
}