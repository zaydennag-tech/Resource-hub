'use client'

import { supabase } from '../../supabaseClient'

export default function RatingSelect({ doc }) {
  async function handleChange(e) {
    const rating = Number(e.target.value)

    await supabase
      .from('ratings')
      .insert({
        document_id: doc.id,
        rating
      })

  }

  return (
    <div style={{ marginTop: '15px' }}>
      <p>Rate this document:</p>

      <select onChange={handleChange} defaultValue="">
        <option value="">Select rating</option>
        <option value="1">1 ⭐</option>
        <option value="2">2 ⭐⭐</option>
        <option value="3">3 ⭐⭐⭐</option>
        <option value="4">4 ⭐⭐⭐⭐</option>
        <option value="5">5 ⭐⭐⭐⭐⭐</option>
      </select>
    </div>
  )
}