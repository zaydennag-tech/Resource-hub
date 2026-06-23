'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  async function fetchFavorites() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        documents (
          id,
          title,
          subject,
          grade,
          year,
          type,
          file_name
        )
      `)
      .eq('user_id', user.id)

    if (!error && data) {
      setFavorites(data)
    }

    setLoading(false)
  }

  async function removeFavorite(id) {
    await supabase
      .from('favorites')
      .delete()
      .eq('id', id)

    setFavorites(prev =>
      prev.filter(f => f.id !== id)
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        Loading favorites...
      </div>
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
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '30px'
        }}
      >
        ⭐ My Favorites
      </h1>

      {favorites.length === 0 ? (
        <p>No favorite documents yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(300px,1fr))',
            gap: '20px'
          }}
        >
          {favorites.map(favorite => {
            const doc = favorite.documents

            return (
              <div
                key={favorite.id}
                style={{
                  background: '#fff',
                  border: '1px solid #ebebeb',
                  borderRadius: '16px',
                  padding: '20px'
                }}
              >
                <h2>{doc.title}</h2>

                <p>📚 {doc.subject}</p>

                <p>🎓 Grade {doc.grade}</p>

                <p>📅 {doc.year}</p>

                <p>{doc.type}</p>

                <a
                  href={`https://xfhmorhwxbirwgboqwqg.supabase.co/storage/v1/object/public/documents/${doc.file_name}`}
                  target="_blank"
                  style={{
                    display: 'block',
                    background: '#111',
                    color: 'white',
                    textAlign: 'center',
                    padding: '12px',
                    borderRadius: '10px',
                    marginTop: '15px',
                    textDecoration: 'none'
                  }}
                >
                  📥 Download
                </a>

                <button
                  onClick={() =>
                    removeFavorite(favorite.id)
                  }
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#dc2626',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Remove Favorite
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}