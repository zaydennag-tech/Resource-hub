'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import RatingSelect from './RatingSelect'
import ReportButton from './ReportButton'

const SUBJECTS = ['All', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Life Sciences', 'English', 'Afrikaans', 'History', 'Geography', 'Business Studies', 'Accounting']

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState('All')

  useEffect(() => {
    fetchDocuments()
  }, [search, subject, grade, year])

  async function fetchDocuments() {
    setLoading(true)

    let { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'approved')
      .order('id', { ascending: false })

    let { data: ratings } = await supabase
      .from('ratings')
      .select('*')

    if (!docs) docs = []
    if (!ratings) ratings = []

    let filtered = docs

    if (search) {
      filtered = filtered.filter(doc =>
        doc.title?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (subject && subject !== 'All') {
      filtered = filtered.filter(doc =>
        doc.subject?.toLowerCase().includes(subject.toLowerCase())
      )
    }

    if (grade) {
      filtered = filtered.filter(doc =>
        String(doc.grade).includes(grade)
      )
    }

    if (year) {
      filtered = filtered.filter(doc =>
        String(doc.year).includes(year)
      )
    }

    const enriched = filtered.map(doc => {
      const docRatings = ratings.filter(r => r.document_id === doc.id)
      const avg = docRatings.length > 0
        ? docRatings.reduce((sum, r) => sum + r.rating, 0) / docRatings.length
        : null
      return { ...doc, avgRating: avg }
    })

    setDocuments(enriched)
    setLoading(false)
  }

  function handleSubjectFilter(s) {
    setActiveSubject(s)
    setSubject(s === 'All' ? '' : s)
  }

  function getTypeColor(type) {
    const map = {
      'Past Paper': '#e8f5e9',
      'Memo': '#e3f2fd',
      'Study Notes': '#fff8e1',
      'Assessment': '#fce4ec',
      'Other': '#f3e5f5'
    }
    return map[type] || '#f5f5f5'
  }

  function getTypeTextColor(type) {
    const map = {
      'Past Paper': '#2e7d32',
      'Memo': '#1565c0',
      'Study Notes': '#f57f17',
      'Assessment': '#c62828',
      'Other': '#6a1b9a'
    }
    return map[type] || '#333'
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          color: #111;
        }

        .page { min-height: 100vh; background: #f9f9f7; }

        /* NAV */
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
          gap: 8px;
        }
        .nav-logo span {
          background: #111;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .nav-upload {
          background: #111;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-upload:hover { background: #333; }

        /* HERO */
        .hero {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 48px 40px 32px;
        }
        .hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #111;
          margin-bottom: 8px;
        }
        .hero p {
          color: #666;
          font-size: 16px;
          margin-bottom: 24px;
        }

        /* SEARCH BAR */
        .search-bar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }
        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 260px;
          max-width: 500px;
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 16px;
        }
        .search-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border: 1.5px solid #e0e0e0;
          border-radius: 100px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: #111; background: #fff; }
        .search-input::placeholder { color: #aaa; }

        .filter-input {
          padding: 14px 18px;
          border: 1.5px solid #e0e0e0;
          border-radius: 100px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: #f9f9f7;
          color: #111;
          outline: none;
          transition: border-color 0.2s;
          width: 130px;
        }
        .filter-input:focus { border-color: #111; background: #fff; }
        .filter-input::placeholder { color: #aaa; }

        /* SUBJECT PILLS */
        .pills-wrap {
          padding: 20px 40px 0;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding-bottom: 20px;
        }
        .pill {
          padding: 8px 18px;
          border-radius: 100px;
          border: 1.5px solid #e0e0e0;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          background: #fff;
          color: #444;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .pill:hover { border-color: #111; color: #111; }
        .pill.active { background: #111; color: #fff; border-color: #111; }

        /* MAIN CONTENT */
        .content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 40px;
        }

        .results-count {
          font-size: 15px;
          color: #555;
          margin-bottom: 24px;
        }
        .results-count strong { color: #111; }

        /* GRID */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        /* CARD */
        .card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .card-top {
          background: #f5f5f3;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          position: relative;
        }
        .card-icon {
          font-size: 40px;
          opacity: 0.8;
        }
        .card-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.3px;
        }
        .card-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fff;
          border: 1px solid #e0e0e0;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: #555;
        }

        .card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #111;
          line-height: 1.3;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tag {
          background: #f5f5f3;
          border: 1px solid #e8e8e8;
          color: #555;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
        }

        .card-footer {
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .download-btn {
          display: block;
          background: #111;
          color: #fff;
          text-align: center;
          text-decoration: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .download-btn:hover { background: #333; }

        /* EMPTY STATE */
        .empty {
          text-align: center;
          padding: 80px 20px;
          color: #aaa;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty h3 {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          color: #555;
          margin-bottom: 8px;
        }

        /* LOADING */
        .loading {
          text-align: center;
          padding: 80px;
          color: #aaa;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .hero { padding: 32px 20px 24px; }
          .hero h1 { font-size: 28px; }
          .pills-wrap { padding: 16px 20px; }
          .content { padding: 24px 20px; }
          .filter-input { width: 100px; }
        }
      `}</style>

      <div className="page">
        {/* NAV */}
        <nav className="nav">
          <a className="nav-logo" href="/">
            <span>📚</span>
            ResourceHub
          </a>
          <a className="nav-upload" href="/upload">Upload Document</a>
        </nav>

        {/* HERO + SEARCH */}
        <div className="hero">
          <h1>Document Library</h1>
          <p>Browse and download approved study resources, past papers and more.</p>

          <div className="search-bar">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <input
              className="filter-input"
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <input
              className="filter-input"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        {/* SUBJECT PILLS */}
        <div className="pills-wrap">
          {SUBJECTS.map(s => (
            <button
              key={s}
              className={`pill ${activeSubject === s ? 'active' : ''}`}
              onClick={() => handleSubjectFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="content">
          {loading ? (
            <div className="loading">Loading documents...</div>
          ) : (
            <>
              <p className="results-count">
                Showing <strong>{documents.length}</strong> document{documents.length !== 1 ? 's' : ''}
                {activeSubject !== 'All' ? ` in ${activeSubject}` : ''}
              </p>

              {documents.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  <h3>No documents found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="grid">
                  {documents.map(doc => (
                    <div className="card" key={doc.id}>
                      <div className="card-top">
                        <span className="card-icon">
                          {doc.type === 'Past Paper' ? '📝' :
                           doc.type === 'Memo' ? '✅' :
                           doc.type === 'Study Notes' ? '📖' :
                           doc.type === 'Assessment' ? '📋' : '📄'}
                        </span>
                        {doc.type && (
                          <span
                            className="card-type-badge"
                            style={{
                              background: getTypeColor(doc.type),
                              color: getTypeTextColor(doc.type)
                            }}
                          >
                            {doc.type}
                          </span>
                        )}
                        {doc.avgRating && (
                          <span className="card-rating-badge">
                            ⭐ {doc.avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="card-body">
                        <div className="card-title">{doc.title}</div>
                        <div className="card-tags">
                          {doc.subject && <span className="tag">📚 {doc.subject}</span>}
                          {doc.grade && <span className="tag">🎓 Grade {doc.grade}</span>}
                          {doc.year && <span className="tag">📅 {doc.year}</span>}
                        </div>
                      </div>

                      <div className="card-footer">
                        <a
                          className="download-btn"
                          href={`https://xfhmorhwxbirwgboqwqg.supabase.co/storage/v1/object/public/documents/${doc.file_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📥 Download
                        </a>
                        <RatingSelect doc={doc} />
                        <ReportButton doc={doc} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}