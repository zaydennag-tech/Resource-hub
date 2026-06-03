'use client'

import { useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function UploadPage() {
  const [title, setTitle] = useState('')
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

    const { error } = await supabase.storage
      .from('documents')
      .upload(file_name, file)

    if (error) {
      setMessage('Upload failed: ' + error.message)
    } else {
      const { error: dbError } = await supabase
        .from('documents')
        .insert([
          {
            title: title,
            file_name: file_name
          }
        ])

      if (dbError) {
        setMessage('Database error: ' + dbError.message)
      
      } else {
        setMessage('✅ File and title saved successfully!')
      }

      setTitle('')
      setFile(null)
    }

    setUploading(false)
  }

  return (
    <main style={{
      maxWidth: "500px",
      margin: "60px auto",
      padding: "40px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ marginBottom: "24px" }}>📄 Upload Document</h1>

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
        Document Title
      </label>

      <input
        type="text"
        placeholder="e.g. Invoice March 2026"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          boxSizing: "border-box"
        }}
      />

      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
        Choose File
      </label>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "24px" }}
      />

      <br />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? "#999" : "#0070f3",
          color: "white",
          padding: "12px 24px",
          fontSize: "16px",
          border: "none",
          borderRadius: "8px",
          cursor: uploading ? "not-allowed" : "pointer",
          width: "100%"
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && (
        <p style={{
          marginTop: "20px",
          color: message.includes('✅') ? 'green' : 'red'
        }}>
          {message}
        </p>
      )}
    </main>
  )
}