'use client'

import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function AdminActions({ doc }) {
  const [loading, setLoading] = useState(null)

  async function approve() {
    setLoading('approve')
    await supabase.from('documents').update({ status: 'approved' }).eq('id', doc.id)
    window.location.reload()
  }

  async function reject() {
    setLoading('reject')
    await supabase.from('documents').update({ status: 'rejected' }).eq('id', doc.id)
    window.location.reload()
  }

  async function verify() {
    setLoading('verify')
    await supabase.from('documents').update({ verified: true }).eq('id', doc.id)
    window.location.reload()
  }

  const statusStyle = {
    pending:   { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    approved:  { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    rejected:  { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
  }

  return (
    <div style={{
      background: 'white', border: '1px solid #e8e8e8',
      borderRadius: '20px', padding: '20px 24px', marginBottom: '12px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111', margin: 0 }}>
            {doc.title || 'Untitled document'}
          </p>
          <p style={{ fontSize: '12px', color: '#bbb', marginTop: '3px', wordBreak: 'break-all' }}>
            {doc.file_name}
          </p>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <span style={{
            fontSize: '12px', fontWeight: '500', padding: '3px 10px',
            borderRadius: '999px',
            ...(statusStyle[doc.status] || statusStyle.pending),
          }}>
            {doc.status}
          </span>
          <span style={{
            fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px',
            ...(doc.verified
              ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
              : { background: '#f5f5f3', color: '#888', border: '1px solid #e8e8e8' }),
          }}>
            {doc.verified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Meta tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {doc.subject && (
          <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>
            {doc.subject}
          </span>
        )}
        {doc.grade && (
          <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>
            Grade {doc.grade}
          </span>
        )}
        {doc.year && (
          <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>
            {doc.year}
          </span>
        )}
        {doc.type && (
          <span style={{ fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: '#f5f5f3', color: '#555', border: '1px solid #e8e8e8' }}>
            {doc.type}
          </span>
        )}
      </div>

      <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '16px' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <button
          onClick={approve}
          disabled={loading !== null}
          style={{
            padding: '8px 16px', borderRadius: '999px',
            border: '1px solid #bbf7d0', background: 'white',
            color: '#16a34a', fontSize: '13px', fontWeight: '500',
            cursor: loading !== null ? 'not-allowed' : 'pointer',
            opacity: loading !== null ? 0.5 : 1,
          }}
        >
          {loading === 'approve' ? 'Approving...' : 'Approve'}
        </button>

        <button
          onClick={reject}
          disabled={loading !== null}
          style={{
            padding: '8px 16px', borderRadius: '999px',
            border: '1px solid #fecaca', background: 'white',
            color: '#ef4444', fontSize: '13px', fontWeight: '500',
            cursor: loading !== null ? 'not-allowed' : 'pointer',
            opacity: loading !== null ? 0.5 : 1,
          }}
        >
          {loading === 'reject' ? 'Rejecting...' : 'Reject'}
        </button>

        <button
          onClick={verify}
          disabled={loading !== null || doc.verified}
          style={{
            padding: '8px 16px', borderRadius: '999px',
            border: '1px solid #bfdbfe', background: 'white',
            color: '#2563eb', fontSize: '13px', fontWeight: '500',
            cursor: (loading !== null || doc.verified) ? 'not-allowed' : 'pointer',
            opacity: (loading !== null || doc.verified) ? 0.5 : 1,
          }}
        >
          {loading === 'verify' ? 'Verifying...' : doc.verified ? 'Verified' : 'Verify'}
        </button>
      </div>
    </div>
  )
}