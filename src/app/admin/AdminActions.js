'use client'

import { supabase } from '../../supabaseClient'

export default function AdminActions({ doc }) {
  async function approve() {
    await supabase
      .from('documents')
      .update({ status: 'approved' })
      .eq('id', doc.id)

    window.location.reload()
  }

  async function reject() {
    await supabase
      .from('documents')
      .update({ status: 'rejected' })
      .eq('id', doc.id)

    window.location.reload()
  }

  async function verify() {
    await supabase
      .from('documents')
      .update({ verified: true })
      .eq('id', doc.id)

    window.location.reload()
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '15px',
        marginTop: '10px',
        borderRadius: '8px'
      }}
    >
      <h3>{doc.title}</h3>

      <p>File: {doc.file_name}</p>

      <p>
        <strong>Status:</strong> {doc.status}
      </p>

      <p>
        <strong>Verification:</strong>{' '}
        {doc.verified ? 'Verified ✅' : 'Pending Verification ⏳'}
      </p>

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={approve}
          style={{
            marginRight: '10px',
            padding: '8px 12px',
            background: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Approve
        </button>

        <button
          onClick={reject}
          style={{
            marginRight: '10px',
            padding: '8px 12px',
            background: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Reject
        </button>

        <button
          onClick={verify}
          style={{
            padding: '8px 12px',
            background: 'blue',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </div>
    </div>
  )
}