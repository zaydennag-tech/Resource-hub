import { supabase } from '../../supabaseClient'
import AdminActions from './AdminActions'

export default async function AdminPage() {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('status', 'pending')
    .order('id', { ascending: false })

  return (
    <main
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px'
      }}
    >
      <h1>🛠️ Admin Moderation Dashboard</h1>

      {error && <p>Error loading documents</p>}

      {documents?.length === 0 && <p>No pending documents 🎉</p>}

      {documents?.map((doc) => (
        <div key={doc.id}>
          <AdminActions doc={doc} />
        </div>
      ))}
    </main>
  )
}