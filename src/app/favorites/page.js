'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabaseClient'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signin')
      return
    }
    const { data, error } = await supabase
      .from('favorites')
      .select('id, documents(id, title, subject, grade, year, type, file_name)')
      .eq('user_id', user.id)
    if (!error && data) setFavorites(data)
    setLoading(false)
  }

  async function removeFavorite(id) {
    await supabase.from('favorites').delete().eq('id', id)
    setFavorites(prev => prev.filter(f => f.id !== id))
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f3' }}>
        <p style={{ color: '#888', fontSize: '14px' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f3', padding: '48px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#111', margin: 0 }}>Favourites</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {favorites.length} saved document{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        {favorites.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '24px', padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '24px', marginBottom: '12px' }}>?</p>
            <p style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '6px' }}>No favourites yet</p>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>Save documents from the library to find them here.</p>
            <button onClick={() => router.push('/')} style={{ padding: '10px 20px', borderRadius: '999px', border: 'none', background: '#111', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Browse documents
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {favorites.map(favorite => {
              const doc = favorite.documents
              if (!doc) return null
              return (
                <div key={favorite.id} style={{ background: 'white', border: '1px solid #e8e8e8', borderRadius: '20px', padding: '20px 24px' }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '10px' }}>{doc.title}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {doc.subject && <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>{doc.subject}</span>}
                    {doc.grade && <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>Grade {doc.grade}</span>}
                    {doc.year && <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>{doc.year}</span>}
                    {doc.type && <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>{doc.type}</span>}
                  </div>
                  <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => removeFavorite(favorite.id)} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid #fecaca', background: 'white', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                      Remove
                    </button>
                    <a href={'https://xfhmorhwxbirwgboqwqg.supabase.co/storage/v1/object/public/documents/' + doc.file_name} target="_blank" style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: '#111', color: 'white', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
                      Download
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
