'use client'

import { supabase } from '../../../supabaseClient'

export default function ReportActions({ doc }) {
  async function clearReports() {
    await supabase
      .from('documents')
      .update({ report_count: 0 })
      .eq('id', doc.id)

    window.location.reload()
  }

  async function removeDocument() {
    await supabase
      .from('documents')
      .update({
        status: 'rejected'
      })
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

      <p>Reports: {doc.report_count}</p>

      <p>Status: {doc.status}</p>

      <button
        onClick={clearReports}
        style={{
          marginRight: '10px',
          padding: '8px 12px',
          background: 'green',
          color: 'white',
          border: 'none'
        }}
      >
        Dismiss Reports
      </button>

      <button
        onClick={removeDocument}
        style={{
          padding: '8px 12px',
          background: 'red',
          color: 'white',
          border: 'none'
        }}
      >
        Remove Document
      </button>
    </div>
  )
}