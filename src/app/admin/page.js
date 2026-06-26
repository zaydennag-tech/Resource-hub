'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../supabaseClient'
import AdminActions from './AdminActions'

export default function AdminPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [error, setError] = useState(false)
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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      router.push('/')
      return
    }

    setAuthorized(true)

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'pending')
      .order('id', { ascending: false })

    if (error) {
      setError(true)
    } else {
      setDocuments(data)
    }

    setLoading(false)
  }

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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', margin: 0 }}>
                Moderation dashboard
              </h1>
              <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#111', color: 'white' }}>
                Admin
              </span>
            </div>
            <Link
              href="/admin/users"
              style={{
                fontSize: '13px', fontWeight: '500', color: '#111',
                textDecoration: 'none', padding: '8px 16px',
                border: '1px solid #e5e5e5', borderRadius: '999px',
                background: 'white',
              }}
            >
              Manage users
            </Link>
          </div>
          <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
            Review and approve submitted documents before they go live
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            color: '#b91c1c', padding: '12px 16px',
            borderRadius: '12px', fontSize: '13px', marginBottom: '20px',
          }}>
            Error loading documents. Please refresh and try again.
          </div>
        )}

        {/* Empty state */}
        {!error && documents.length === 0 && (
          <div style={{
            background: 'white', border: '1px solid #e8e8e8',
            borderRadius: '24px', padding: '60px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '24px', marginBottom: '12px' }}>🎉</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '6px' }}>
              All caught up!
            </p>
            <p style={{ fontSize: '14px', color: '#888' }}>
              No pending documents to review right now.
            </p>
          </div>
        )}

        {/* Queue */}
        {documents.length > 0 && (
          <>
            <p style={{ fontSize: '12px', fontWeight: '500', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              {documents.length} pending review
            </p>
            {documents.map((doc) => (
              <AdminActions key={doc.id} doc={doc} />
            ))}
          </>
        )}

      </div>
    </main>
  )
}