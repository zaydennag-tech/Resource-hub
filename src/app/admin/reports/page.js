import { supabase } from '../../../supabaseClient'
import ReportActions from './ReportActions'

export default async function ReportsPage() {
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .gt('report_count', 0)
    .order('report_count', { ascending: false })

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1>🚨 Reported Documents</h1>

      {documents?.length === 0 && (
        <p>No reported documents 🎉</p>
      )}

      {documents?.map((doc) => (
        <ReportActions key={doc.id} doc={doc} />
      ))}
    </main>
  )
}