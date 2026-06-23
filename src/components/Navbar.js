'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabaseClient'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/signin')
    router.refresh()
  }

  const linkStyle = {
    fontSize: '14px',
    color: '#555',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '6px 12px',
    borderRadius: '999px',
    transition: 'background 0.15s, color 0.15s',
  }

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 40px',
      borderBottom: '1px solid #ebebeb',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', background: '#111',
          borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <span style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Tutorverse</span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <Link href="/" style={linkStyle}>Browse</Link>

        {user ? (
          <>
            <Link href="/upload" style={linkStyle}>Upload</Link>
            <Link href="/my-uploads" style={linkStyle}>My Uploads</Link>
            <Link href="/profile" style={linkStyle}>Profile</Link>
            <Link href="/favorites" style={linkStyle}>
  Favorites
</Link>
            <button
              onClick={logout}
              style={{
                marginLeft: '8px',
                background: '#111',
                color: 'white',
                border: 'none',
                padding: '9px 20px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" style={linkStyle}>Sign in</Link>
            <Link
              href="/signup"
              style={{
                marginLeft: '8px',
                background: '#111',
                color: 'white',
                padding: '9px 20px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
              }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}