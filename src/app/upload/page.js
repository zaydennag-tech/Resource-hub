'use client'

import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function UploadPage() {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUpload() {
    if (!title || !file) {
      setMessage('Please enter a title and choose a file.')
      return
    }

    setUploading(true)
    setMessage('')

    const file_name = `${Date.now()}_${file.name}`

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(file_name, file)

    if (storageError) {
      setMessage('Upload failed: ' + storageError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase
      .from('documents')
      .insert([
        {
          title,
          file_name,
          subject: subject || null,
          grade: grade || null,
          year: year ? parseInt(year) : null,
          type: type || null,
          status: 'pending',
          verified: false,
          created_at: new Date().toISOString()
        }
      ])

    if (dbError) {
      setMessage('Database error: ' + dbError.message)
    } else {
      setMessage('✅ Document uploaded! It will appear in the library once approved.')
      setTitle('')
      setSubject('')
      setGrade('')
      setYear('')
      setType('')
      setFile(null)
    }

    setUploading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '16px',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px'
  }

  return (
    <main style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '40px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ marginBottom: '24px' }}>📄 Upload Document</h1>

      <label style={labelStyle}>Document Title *</label>
      <input
        type="text"
        placeholder="e.g. Maths Paper 1 Grade 11 2024"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Subject</label>
      <input
        type="text"
        placeholder="e.g. Mathematics"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Grade</label>
      <input
        type="text"
        placeholder="e.g. 11"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Year</label>
      <input
        type="number"
        placeholder="e.g. 2024"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Document Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select type...</option>
        <option value="Past Paper">Past Paper</option>
        <option value="Memo">Memo</option>
        <option value="Study Notes">Study Notes</option>
        <option value="Assessment">Assessment</option>
        <option value="Other">Other</option>
      </select>

      <label style={labelStyle}>Choose File *</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: '24px' }}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? '#999' : '#0070f3',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p style={{
          marginTop: '20px',
          color: message.includes('✅') ? 'green' : 'red'
        }}>
          {message}
        </p>
      )}
    </main>
  )
}