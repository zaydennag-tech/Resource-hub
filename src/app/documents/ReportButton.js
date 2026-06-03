'use client'

import { supabase } from '../../supabaseClient'

export default function ReportButton({ doc }) {
  async function report() {
    const newCount = (doc.report_count || 0) + 1

    const { error } = await supabase
      .from('documents')
      .update({ report_count: newCount })
      .eq('id', doc.id)

    if (error) {
      alert('Failed to submit report')
      return
    }

    alert('🚨 Report submitted successfully')
    window.location.reload()
  }

  return (
    <div
      style={{
        marginTop: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}
    >
      <span
        style={{
          color: '#cbd5e1',
          fontSize: '14px'
        }}
      >
        🚨 Reports: {doc.report_count || 0}
      </span>

      <button
        onClick={report}
        style={{
          background: 'linear-gradient(135deg,#f97316,#ea580c)',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 8px 20px rgba(249,115,22,.25)'
        }}
      >
        Report
      </button>
    </div>
  )
}