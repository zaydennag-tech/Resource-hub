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

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/signin')
      return
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })

    if (!error) {
      setDocuments(data)
    }

    setLoading(false)
  }

  async function deleteDocument(id) {
    const confirmDelete = confirm(
      'Are you sure you want to delete this document?'
    )

    if (!confirmDelete) return

    await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title?.toLowerCase().includes(search.toLowerCase())
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
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '10px'
        }}
      >
        My Uploads
      </h1>

      <p
        style={{
          color: '#666',
          marginBottom: '30px'
        }}
      >
        Manage your uploaded resources.
      </p>

      <input
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid #ddd',
          marginBottom: '30px'
        }}
      />

      {filteredDocuments.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 0',
            color: '#666'
          }}
        >
          No documents found.
        </div>
      ) : (
        filteredDocuments.map(doc => (
          <div
            key={doc.id}
            style={{
              background: 'white',
              border: '1px solid #ebebeb',
              borderRadius: '24px',
              padding: '25px',
              marginBottom: '20px'
            }}
          >
            <h2
              style={{
                fontSize: '1.4rem',
                marginBottom: '10px'
              }}
            >
              {doc.title}
            </h2>

            <p
              style={{
                color: '#666',
                marginBottom: '8px'
              }}
            >
              File: {doc.file_name}
            </p>

            <p
              style={{
                color: '#666',
                marginBottom: '8px'
              }}
            >
              Rating: ⭐ {doc.rating ?? 'N/A'}
            </p>

            <p
              style={{
                marginBottom: '20px',
                color:
                  doc.status === 'approved'
                    ? 'green'
                    : doc.status === 'pending'
                    ? 'orange'
                    : 'red'
              }}
            >
              Status: {doc.status}
            </p>

            <button
              onClick={() => deleteDocument(doc.id)}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '14px 22px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </main>
  )
}
