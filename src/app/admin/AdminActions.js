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

  return (
    <>
      <style>{`
        .admin-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          transition: box-shadow 0.2s;
        }
        .admin-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        .admin-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .admin-card-title {
          font-family: 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #111;
          margin-bottom: 4px;
        }
        .admin-card-file {
          font-size: 13px;
          color: #aaa;
          word-break: break-all;
        }

        .admin-badges {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .badge-pending { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .badge-verified { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .badge-unverified { background: #f5f5f3; color: #888; border: 1px solid #e8e8e8; }

        .admin-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .meta-tag {
          background: #f5f5f3;
          border: 1px solid #e8e8e8;
          color: #555;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .action-btn {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          transition: opacity 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .action-btn:hover { opacity: 0.85; }
        .action-btn:active { transform: scale(0.97); }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-approve { background: #16a34a; color: #fff; }
        .btn-reject { background: #fff; color: #dc2626; border: 1.5px solid #fecaca; }
        .btn-verify { background: #2563eb; color: #fff; }
      `}</style>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-title">{doc.title || 'Untitled Document'}</div>
            <div className="admin-card-file">{doc.file_name}</div>
          </div>
          <div className="admin-badges">
            <span className="badge badge-pending">⏳ {doc.status}</span>
            <span className={`badge ${doc.verified ? 'badge-verified' : 'badge-unverified'}`}>
              {doc.verified ? '✅ Verified' : '⏳ Unverified'}
            </span>
          </div>
        </div>

        <div className="admin-meta">
          {doc.subject && <span className="meta-tag">📚 {doc.subject}</span>}
          {doc.grade && <span className="meta-tag">🎓 Grade {doc.grade}</span>}
          {doc.year && <span className="meta-tag">📅 {doc.year}</span>}
          {doc.type && <span className="meta-tag">📄 {doc.type}</span>}
        </div>

        <div className="admin-actions">
          <button
            className="action-btn btn-approve"
            onClick={approve}
            disabled={loading !== null}
          >
            {loading === 'approve' ? '...' : '✅ Approve'}
          </button>

          <button
            className="action-btn btn-reject"
            onClick={reject}
            disabled={loading !== null}
          >
            {loading === 'reject' ? '...' : '✕ Reject'}
          </button>

          <button
            className="action-btn btn-verify"
            onClick={verify}
            disabled={loading !== null || doc.verified}
          >
            {loading === 'verify' ? '...' : doc.verified ? '✅ Verified' : '🔵 Verify'}
          </button>
        </div>
      </div>
    </>
  )
}