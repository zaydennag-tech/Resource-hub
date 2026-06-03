'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import RatingSelect from './RatingSelect'
import ReportButton from './ReportButton'

export default function DocumentsPage() {
const [documents, setDocuments] = useState([])
const [search, setSearch] = useState('')
const [subject, setSubject] = useState('')
const [grade, setGrade] = useState('')
const [year, setYear] = useState('')

useEffect(() => {
fetchDocuments()
}, [search, subject, grade, year])

async function fetchDocuments() {
let { data: docs } = await supabase
.from('documents')
.select('*')
.eq('status', 'approved')
.order('id', { ascending: false })

```
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

if (subject) {
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
  const docRatings = ratings.filter(
    r => r.document_id === doc.id
  )

  const avg =
    docRatings.length > 0
      ? docRatings.reduce((sum, r) => sum + r.rating, 0) /
        docRatings.length
      : null

  return {
    ...doc,
    avgRating: avg
  }
})

setDocuments(enriched)
```

}

return ( <main style={styles.container}>

```
  <div style={styles.header}>
    <h1 style={styles.title}>📚 Document Library</h1>
    <p style={styles.subtitle}>
      Browse approved educational resources.
    </p>
  </div>

  <div style={styles.stats}>
    <div style={styles.statCard}>
      <h3>{documents.length}</h3>
      <p>Documents</p>
    </div>
  </div>

  <div style={styles.filters}>
    <input
      placeholder="🔍 Search documents..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={styles.input}
    />

    <input
      placeholder="📚 Subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      style={styles.input}
    />

    <input
      placeholder="🎓 Grade"
      value={grade}
      onChange={(e) => setGrade(e.target.value)}
      style={styles.input}
    />

    <input
      placeholder="📅 Year"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      style={styles.input}
    />
  </div>

  <div style={styles.grid}>
    {documents.map(doc => (
      <div
        key={doc.id}
        style={styles.card}
      >
        <h2>{doc.title}</h2>

        <div style={styles.tags}>
          <span>📚 {doc.subject}</span>
          <span>🎓 Grade {doc.grade}</span>
          <span>📅 {doc.year}</span>
        </div>

        <p style={styles.rating}>
          ⭐ {doc.avgRating
            ? doc.avgRating.toFixed(1)
            : 'No ratings yet'}
        </p>

        <a
          href={`https://xfhmorhwxbirwgboqwqg.supabase.co/storage/v1/object/public/documents/${doc.file_name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button style={styles.downloadBtn}>
            📥 Download
          </button>
        </a>

        <div style={{ marginTop: 15 }}>
          <RatingSelect doc={doc} />
        </div>

        <div style={{ marginTop: 10 }}>
          <ReportButton doc={doc} />
        </div>
      </div>
    ))}
  </div>

</main>


)
}

const styles = {
container: {
minHeight: '100vh',
padding: '40px',
color: 'white',
background:
'linear-gradient(135deg,#0f172a,#111827,#1e3a8a)',
fontFamily:
'-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif'
},

header: {
textAlign: 'center',
marginBottom: '40px'
},

title: {
fontSize: '48px',
fontWeight: '800'
},

subtitle: {
color: '#cbd5e1'
},

stats: {
display: 'flex',
justifyContent: 'center',
marginBottom: '30px'
},

statCard: {
background: 'rgba(30,41,59,.75)',
padding: '20px',
borderRadius: '16px',
minWidth: '180px',
textAlign: 'center'
},

filters: {
display: 'grid',
gridTemplateColumns:
'repeat(auto-fit,minmax(220px,1fr))',
gap: '15px',
marginBottom: '30px'
},

input: {
padding: '14px',
borderRadius: '12px',
border: '1px solid rgba(255,255,255,.1)',
background: 'rgba(30,41,59,.75)',
color: 'white'
},

grid: {
display: 'grid',
gridTemplateColumns:
'repeat(auto-fit,minmax(320px,1fr))',
gap: '20px'
},

card: {
background: 'rgba(30,41,59,.75)',
backdropFilter: 'blur(10px)',
border: '1px solid rgba(255,255,255,.08)',
borderRadius: '18px',
padding: '24px'
},

tags: {
display: 'flex',
flexWrap: 'wrap',
gap: '10px',
color: '#cbd5e1',
marginBottom: '15px'
},

rating: {
fontSize: '18px',
marginBottom: '15px'
},

downloadBtn: {
background:
'linear-gradient(135deg,#2563eb,#3b82f6)',
color: 'white',
border: 'none',
padding: '12px 20px',
borderRadius: '10px',
cursor: 'pointer',
fontWeight: '600'
}
}
