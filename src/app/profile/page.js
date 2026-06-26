'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../supabaseClient'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
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
      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f3' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
      </main>
    )
  }

  const initials =
    user?.user_metadata?.full_name
      ?.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase() || user.email[0].toUpperCase()

  const fullName = user?.user_metadata?.full_name || 'User'
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '48px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Profile card */}
        <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '24px', padding: '40px', marginBottom: '16px' }}>

          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#111', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', fontWeight: '600', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#111', margin: 0 }}>
                {fullName}
              </h1>
              <p style={{ fontSize: '14px', color: '#888', margin: '4px 0 0' }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '24px' }} />

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Email</span>
              <span style={{ fontSize: '13px', color: '#111', fontWeight: '500' }}>{user.email}</span>
            </div>
            <div style={{ height: '1px', background: '#f7f7f7' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Member since</span>
              <span style={{ fontSize: '13px', color: '#111', fontWeight: '500' }}>{joinDate}</span>
            </div>
            <div style={{ height: '1px', background: '#f7f7f7' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#888' }}>Account</span>
              <span style={{ fontSize: '12px', color: '#555', fontWeight: '500', background: '#f5f5f3', padding: '4px 12px', borderRadius: '999px', border: '1px solid #e8e8e8' }}>
                Free plan
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/my-uploads"
              style={{
                background: '#111', color: 'white',
                padding: '10px 20px', borderRadius: '999px',
                fontSize: '14px', fontWeight: '500', textDecoration: 'none',
              }}
            >
              My uploads
            </Link>
            <Link
              href="/settings"
              style={{
                background: 'white', color: '#111',
                padding: '10px 20px', borderRadius: '999px',
                fontSize: '14px', fontWeight: '500', textDecoration: 'none',
                border: '1px solid #e5e5e5',
              }}
            >
              Settings
            </Link>
            <button
              onClick={logout}
              style={{
                background: 'white', color: '#ef4444',
                padding: '10px 20px', borderRadius: '999px',
                fontSize: '14px', fontWeight: '500',
                border: '1px solid #fecaca', cursor: 'pointer',
                marginLeft: 'auto',
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Quick links card */}
        <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '24px', padding: '24px 40px' }}>
          <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Quick links
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { href: '/', label: 'Browse documents', icon: '📄' },
              { href: '/upload', label: 'Upload a document', icon: '⬆️' },
              { href: '/my-uploads', label: 'My uploads', icon: '📁' },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '12px',
                  fontSize: '14px', color: '#333', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f5f3'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}