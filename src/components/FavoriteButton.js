'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FavoriteButton({ doc }) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    checkFavorite()
  }, [])

  async function checkFavorite() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('document_id', doc.id)
      .single()

    if (data) {
      setIsFavorite(true)
    }
  }

  async function toggleFavorite() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Please sign in first.')
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('document_id', doc.id)

      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          document_id: doc.id
        })

      setIsFavorite(true)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      style={{
        padding: '12px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        background: isFavorite ? '#facc15' : '#e5e7eb',
        color: '#111',
        fontWeight: 600
      }}
    >
      {isFavorite ? '⭐ Favorited' : '☆ Add to Favorites'}
    </button>
  )
}