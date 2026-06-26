'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabaseClient'

export default function MyUploadsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocuments()
  }, [])

  async function getDocuments() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signin')
      return
    }
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })
    if (!error) setDocuments(data)
    setLoading(false)
  }

  async function deleteDocument(id) {
    const confirmDelete = confirm('Are you sure you want to delete this document?')
    if (!confirmDelete) return
    await supabase.from('documents').delete().eq('id', id)
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title?.toLowerCase().includes(search.toLowerCase())
  )

  const statusStyle = (status) => ({
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '999px',
    ...(status === 'approved'
      ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
      : status === 'pending'
      ? { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }
      : { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }),
  })

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f3' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '48px 20px', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', margin: 0 }}>My uploads</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
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
            placeholder="Search your uploads..."
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
        {filteredDocuments.length === 0 ? (
          <div style={{
            background: 'white', border: '1px solid #e8e8e8',
            borderRadius: '24px', padding: '60px 20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '14px', color: '#888' }}>
              {search ? 'No documents match your search.' : "You haven't uploaded anything yet."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredDocuments.map(doc => (
              <div
                key={doc.id}
                style={{
                  background: 'white', border: '1px solid #e8e8e8',
                  borderRadius: '20px', padding: '20px 24px',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111', margin: 0 }}>
                    {doc.title}
                  </h2>
                  <span style={statusStyle(doc.status)}>
                    {doc.status}
                  </span>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#888' }}>
                    📄 {doc.file_name}
                  </span>
                  <span style={{ fontSize: '13px', color: '#888' }}>
                    ⭐ {doc.rating ?? 'N/A'}
                  </span>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '16px' }} />

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    style={{
                      padding: '8px 18px', borderRadius: '999px',
                      border: '1px solid #fecaca', background: 'white',
                      color: '#ef4444', fontSize: '13px', fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
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