'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/supabaseClient'

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/signin')
      return
    }

    setUser(user)
    setLoading(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f9f9f7'
        }}
      >
        Loading...
      </main>
    )
  }

  const initials =
    user?.user_metadata?.full_name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || user.email[0].toUpperCase()

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f9f9f7',
        padding: '60px 20px'
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #ebebeb',
            borderRadius: '28px',
            padding: '50px'
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: '#111',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '25px'
            }}
          >
            {initials}
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '800'
            }}
          >
            {user.user_metadata.full_name || 'User'}
          </h1>

          <p
            style={{
              color: '#666',
              marginTop: '10px'
            }}
          >
            {user.email}
          </p>

          <p
            style={{
              color: '#888',
              marginTop: '15px'
            }}
          >
            Joined{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginTop: '40px',
              flexWrap: 'wrap'
            }}
          >
            <Link
              href="/my-uploads"
              style={{
                background: '#111',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '999px'
              }}
            >
              My Uploads
            </Link>

            <Link
              href="/settings"
              style={{
                border: '1px solid #ebebeb',
                padding: '16px 24px',
                borderRadius: '999px'
              }}
            >
              Settings
            </Link>

            <button
              onClick={logout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '999px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}