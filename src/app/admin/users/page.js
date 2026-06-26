'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../supabaseClient'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  async function checkAdminAndLoad() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/signin')
      return
    }

    // Check if user is admin in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (error || !profile?.is_admin) {
      router.push('/')
      return
    }

    setAuthorized(true)
    loadUsers()
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setUsers(data)
    setLoading(false)
  }

  async function toggleAdmin(id, currentValue) {
    await supabase
      .from('profiles')
      .update({ is_admin: !currentValue })
      .eq('id', id)
    loadUsers()
  }

  async function toggleBan(id, currentValue) {
    await supabase
      .from('profiles')
      .update({ is_banned: !currentValue })
      .eq('id', id)
    loadUsers()
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading || !authorized) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f3' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '48px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', margin: 0 }}>User management</h1>
            <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#111', color: 'white' }}>
              Admin
            </span>
          </div>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
            {users.length} total user{users.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px 12px 42px',
              borderRadius: '12px', border: '1px solid #e5e5e5',
              background: 'white', fontSize: '14px', outline: 'none', color: '#111',
            }}
          />
        </div>

        {/* Empty state */}
        {filteredUsers.length === 0 ? (
          <div style={{
            background: 'white', border: '1px solid #e8e8e8',
            borderRadius: '24px', padding: '60px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#888' }}>No users found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map(user => (
              <div
                key={user.id}
                style={{
                  background: 'white', border: '1px solid #e8e8e8',
                  borderRadius: '20px', padding: '20px 24px',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: '#111', color: 'white', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: '600',
                    }}>
                      {(user.full_name || user.email || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>
                        {user.full_name || 'Unnamed user'}
                      </p>
                      <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {user.is_admin && (
                      <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                        Admin
                      </span>
                    )}
                    {user.is_banned && (
                      <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>
                        Banned
                      </span>
                    )}
                    {!user.is_admin && !user.is_banned && (
                      <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <p style={{ fontSize: '12px', color: '#bbb', marginBottom: '16px' }}>
                  Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '16px' }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => toggleAdmin(user.id, user.is_admin)}
                    style={{
                      padding: '8px 16px', borderRadius: '999px',
                      border: '1px solid #bfdbfe', background: 'white',
                      color: '#2563eb', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    {user.is_admin ? 'Remove admin' : 'Make admin'}
                  </button>
                  <button
                    onClick={() => toggleBan(user.id, user.is_banned)}
                    style={{
                      padding: '8px 16px', borderRadius: '999px',
                      border: '1px solid #fecaca', background: 'white',
                      color: '#ef4444', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    {user.is_banned ? 'Unban' : 'Ban user'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}