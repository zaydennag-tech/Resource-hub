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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  async function loadUser() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

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

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName
      }
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Profile updated successfully.')
    }

    setLoading(false)
  }

  async function updatePassword(e) {
    e.preventDefault()

    if (!password) return

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password updated successfully.')
      setPassword('')
    }

    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <main
      style={{
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px'
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '40px'
        }}
      >
        Settings
      </h1>

      <div
        style={{
          background: 'white',
          border: '1px solid #ebebeb',
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '30px'
        }}
      >
        <h2>Profile</h2>

        <form onSubmit={updateProfile}>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '20px',
              marginBottom: '15px',
              borderRadius: '16px'
            }}
          />

          <input
            value={email}
            disabled
            style={{
              width: '100%',
              padding: '16px',
              marginBottom: '20px',
              borderRadius: '16px'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#111',
              color: 'white',
              border: 'none',
              padding: '14px 22px',
              borderRadius: '999px',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </form>
      </div>

      <div
        style={{
          background: 'white',
          border: '1px solid #ebebeb',
          borderRadius: '24px',
          padding: '30px',
          marginBottom: '30px'
        }}
      >
        <h2>Password</h2>

        <form onSubmit={updatePassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '20px',
              marginBottom: '20px',
              borderRadius: '16px'
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '14px 22px',
              borderRadius: '999px',
              cursor: 'pointer'
            }}
          >
            Change Password
          </button>
        </form>
      </div>

      <div
        style={{
          background: 'white',
          border: '1px solid #ebebeb',
          borderRadius: '24px',
          padding: '30px'
        }}
      >
        <h2>Account</h2>

        <button
          onClick={logout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '14px 22px',
            borderRadius: '999px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Logout
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: '30px',
            color: '#666'
          }}
        >
          {message}
        </p>
      )}
    </main>
  )
}
