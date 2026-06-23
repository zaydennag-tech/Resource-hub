'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../supabaseClient'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setUsers(data)
    }

    setLoading(false)
  }

  async function toggleAdmin(id, currentValue) {
    await supabase
      .from('profiles')
      .update({
        is_admin: !currentValue
      })
      .eq('id', id)

    loadUsers()
  }

  async function toggleBan(id, currentValue) {
    await supabase
      .from('profiles')
      .update({
        is_banned: !currentValue
      })
      .eq('id', id)

    loadUsers()
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Loading...
      </main>
    )
  }

  return (
    <main
      style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '30px'
        }}
      >
        User Management
      </h1>

      <input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          marginBottom: '30px'
        }}
      />

      {filteredUsers.map(user => (
        <div
          key={user.id}
          style={{
            background: 'white',
            border: '1px solid #ebebeb',
            borderRadius: '24px',
            padding: '25px',
            marginBottom: '20px'
          }}
        >
          <h2>
            {user.full_name || 'Unnamed User'}
          </h2>

          <p>{user.email}</p>

          <p>
            Role: {user.is_admin ? 'Admin' : 'User'}
          </p>

          <p>
            Status: {user.is_banned ? 'Banned' : 'Active'}
          </p>

          <p>
            Joined:{' '}
            {new Date(user.created_at).toLocaleDateString()}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px'
            }}
          >
            <button
              onClick={() =>
                toggleAdmin(user.id, user.is_admin)
              }
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '999px',
                cursor: 'pointer'
              }}
            >
              {user.is_admin
                ? 'Remove Admin'
                : 'Make Admin'}
            </button>

            <button
              onClick={() =>
                toggleBan(user.id, user.is_banned)
              }
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '999px',
                cursor: 'pointer'
              }}
            >
              {user.is_banned
                ? 'Unban User'
                : 'Ban User'}
            </button>
          </div>
        </div>
      ))}
    </main>
  )
}
