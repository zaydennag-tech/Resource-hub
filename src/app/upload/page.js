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
      setMessage('error:Please enter a title and choose a file.')
      return
    }

    setUploading(true)
    setMessage('')

    const file_name = `${Date.now()}_${file.name}`

    const { error: storageError } = await supabase.storage
      .from('documents')
      .upload(file_name, file)

    if (storageError) {
      setMessage('error:Upload failed: ' + storageError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase
      .from('documents')
      .insert([{
        title,
        file_name,
        subject: subject || null,
        grade: grade || null,
        year: year ? parseInt(year) : null,
        type: type || null,
        status: 'pending',
        verified: false,
        created_at: new Date().toISOString()
      }])

    if (dbError) {
      setMessage('error:Database error: ' + dbError.message)
    } else {
      setMessage('success:Your document has been submitted and will appear in the library once approved.')
      setTitle('')
      setSubject('')
      setGrade('')
      setYear('')
      setType('')
      setFile(null)
    }

    setUploading(false)
  }

  const isSuccess = message.startsWith('success:')
  const isError = message.startsWith('error:')
  const messageText = message.replace(/^(success:|error:)/, '')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f9f9f7; color: #111; }

        .nav {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-logo {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #111;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-logo-icon {
          background: #111;
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
        }
        .nav-link {
          color: #555;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1.5px solid #e0e0e0;
          transition: border-color 0.15s;
        }
        .nav-link:hover { border-color: #111; color: #111; }

        .page {
          min-height: 100vh;
          background: #f9f9f7;
          padding: 48px 20px;
        }

        .card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 20px;
          padding: 40px;
          max-width: 560px;
          margin: 0 auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }

        .card-header {
          margin-bottom: 32px;
        }
        .card-header h1 {
          font-family: 'Sora', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #111;
          margin-bottom: 6px;
        }
        .card-header p { font-size: 14px; color: #888; }

        .divider {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 24px 0;
        }

        .field { margin-bottom: 20px; }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #444;
          margin-bottom: 8px;
          letter-spacing: 0.2px;
        }
        .field .required { color: #dc2626; margin-left: 2px; }

        .input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          border: 1.5px solid #e0e0e0;
          border-radius: 10px;
          background: #f9f9f7;
          color: #111;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .input:focus { border-color: #111; background: #fff; }
        .input::placeholder { color: #bbb; }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .file-drop {
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          padding: 28px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #f9f9f7;
          position: relative;
        }
        .file-drop:hover { border-color: #111; background: #f5f5f3; }
        .file-drop input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .file-drop-icon { font-size: 28px; margin-bottom: 8px; }
        .file-drop-text { font-size: 14px; color: #555; font-weight: 500; }
        .file-drop-hint { font-size: 12px; color: #aaa; margin-top: 4px; }
        .file-selected {
          font-size: 13px;
          color: #16a34a;
          font-weight: 600;
          margin-top: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .submit-btn:hover:not(:disabled) { background: #333; }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; }

        .message {
          margin-top: 16px;
          padding: 14px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
        }
        .message-success {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }
        .message-error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .progress-bar {
          height: 3px;
          background: #e0e0e0;
          border-radius: 100px;
          margin-bottom: 32px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #111;
          border-radius: 100px;
          animation: progress 1.5s ease-in-out infinite;
          width: 40%;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }

        @media (max-width: 600px) {
          .card { padding: 28px 20px; }
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <nav className="nav">
        <a className="nav-logo" href="/">
          <span className="nav-logo-icon">📚</span>
          ResourceHub
        </a>
        <a className="nav-link" href="/documents">← Browse Library</a>
      </nav>

      <div className="page">
        <div className="card">
          <div className="card-header">
            <h1>Upload a Document</h1>
            <p>Share your study materials with students across South Africa.</p>
          </div>

          {uploading && (
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          )}

          <div className="field">
            <label>Document Title <span className="required">*</span></label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Maths Paper 1 Grade 11 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Subject</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Grade</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. 11"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Year</label>
              <input
                className="input"
                type="number"
                placeholder="e.g. 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Document Type</label>
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select type...</option>
              <option value="Past Paper">Past Paper</option>
              <option value="Memo">Memo</option>
              <option value="Study Notes">Study Notes</option>
              <option value="Assessment">Assessment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <hr className="divider" />

          <div className="field">
            <label>File <span className="required">*</span></label>
            <div className="file-drop">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="file-drop-icon">📎</div>
              <div className="file-drop-text">Click to choose a file</div>
              <div className="file-drop-hint">PDF, DOC, DOCX, PPT supported</div>
            </div>
            {file && (
              <div className="file-selected">✓ {file.name}</div>
            )}
          </div>

          <button
            className="submit-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? '⏳ Uploading...' : '📤 Submit Document'}
          </button>

          {message && (
            <div className={`message ${isSuccess ? 'message-success' : 'message-error'}`}>
              {isSuccess ? '✅ ' : '⚠️ '}{messageText}
            </div>
          )}
        </div>
      </div>
    </>
  )
}