'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabaseClient'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signin')
      return
    }
    setUser(user)
    setEmail(user.email)
    setFullName(user.user_metadata?.full_name || '')
  }

  async function updateProfile(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else {
      setMessage('Profile updated successfully.')
      setMessageType('success')
    }
    setLoading(false)
  }

  async function updatePassword(e) {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else {
      setMessage('Password updated successfully.')
      setMessageType('success')
      setPassword('')
    }
    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/signin')
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

  const cardStyle = {
    background: 'white',
    border: '1px solid #e8e8e8',
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '16px',
  }

  const sectionTitleStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111',
    marginBottom: '20px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '48px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Manage your account preferences</p>
        </div>

        {/* Profile card */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Profile</p>
          <form onSubmit={updateProfile}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Email address</label>
              <input
                value={email}
                disabled
                style={{ ...inputStyle, color: '#aaa', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '12px', color: '#bbb', marginTop: '6px' }}>Email cannot be changed</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: '999px',
                border: 'none', background: '#111', color: 'white',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Password</p>
          <form onSubmit={updatePassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>New password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: '999px',
                border: 'none', background: '#111', color: 'white',
                fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

        {/* Account card */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Account</p>
          <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '20px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#111', margin: 0 }}>Log out</p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>Sign out of your account</p>
            </div>
            <button
              onClick={logout}
              style={{
                padding: '10px 20px', borderRadius: '999px',
                border: '1px solid #fecaca', background: 'white',
                color: '#ef4444', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p style={{
            fontSize: '13px',
            color: messageType === 'success' ? '#16a34a' : '#ef4444',
            background: messageType === 'success' ? '#f0fdf4' : '#fef2f2',
            padding: '10px 16px',
            borderRadius: '12px',
            marginTop: '8px',
          }}>
            {message}
          </p>
        )}

      </div>
    </main>
  )
}