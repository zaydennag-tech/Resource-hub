import { supabase } from '@/supabaseClient'

export async function generateMetadata({ params }) {
  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single()

  return {
    title: doc?.title || 'Document',
    description: `Download ${doc?.title} - ${doc?.subject || 'Study resource'}`
  }
}

export default async function DocumentPage({ params }) {
  const { data: doc, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !doc) {
    return <p>Document not found</p>
  }
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: doc.title,
  educationalLevel: doc.grade,
  about: doc.subject,
  datePublished: doc.created_at,
  learningResourceType: doc.type || 'Study Resource',
  aggregateRating: doc.rating
    ? {
        '@type': 'AggregateRating',
        ratingValue: doc.rating,
        reviewCount: 1
      }
    : undefined
}
  return (
    <main
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd)
  }}
/>
      {/* TITLE */}
      <h1>{doc.title}</h1>

      {/* META INFO */}
      <p><strong>Subject:</strong> {doc.subject || 'N/A'}</p>
      <p><strong>Grade:</strong> {doc.grade || 'N/A'}</p>
      <p><strong>Year:</strong> {doc.year || 'N/A'}</p>
      <p><strong>Type:</strong> {doc.type || 'N/A'}</p>

      {/* STATUS (for admin visibility) */}
      <p><strong>Status:</strong> {doc.status}</p>
      <p><strong>Verified:</strong> {doc.verified ? 'Yes ✅' : 'No ❌'}</p>

      {/* DOWNLOAD */}
      <a
        href={`https://xfhmorhwxbirwgboqwqg.supabase.co/storage/v1/object/public/documents/${doc.file_name}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          style={{
            marginTop: '15px',
            padding: '10px 15px'
          }}
        >
          Download Document
        </button>
      </a>

      {/* ⭐ RATING DISPLAY ONLY (no editing here for SEO safety) */}
      <div style={{ marginTop: '20px' }}>
        <p><strong>Rating:</strong> {doc.rating ?? 'Not rated'}</p>
      </div>

      {/* 📌 SEO TEXT (VERY IMPORTANT FOR GOOGLE) */}
      <section style={{ marginTop: '30px' }}>
        <h2>About this document</h2>
        <p>
          This resource is part of the student document library. It may include
          past papers, memos, study notes or assessments for {doc.subject || 'various subjects'}.
        </p>
      </section>
    </main>
  )
}