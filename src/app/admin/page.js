import { supabase } from '../../supabaseClient'
import AdminActions from './AdminActions'

export default async function AdminPage() {
  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('status', 'pending')
    .order('id', { ascending: false })

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
        .nav-badge {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }

        .page { min-height: 100vh; background: #f9f9f7; }

        .header {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 40px;
        }
        .header-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .header h1 {
          font-family: 'Sora', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #111;
          margin-bottom: 6px;
        }
        .header p { color: #888; font-size: 15px; }

        .content {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 40px;
        }

        .empty-state {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 64px 32px;
          text-align: center;
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
        .empty-state h3 {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #111;
          margin-bottom: 8px;
        }
        .empty-state p { color: #888; font-size: 15px; }

        .queue-label {
          font-size: 13px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .nav { padding: 0 20px; }
          .header { padding: 28px 20px; }
          .content { padding: 24px 20px; }
        }
      `}</style>

      <div className="page">
        <nav className="nav">
          <a className="nav-logo" href="/">
            <span className="nav-logo-icon">📚</span>
            ResourceHub
          </a>
          <span className="nav-badge">🛠️ Admin</span>
        </nav>

        <div className="header">
          <div className="header-inner">
            <h1>Moderation Dashboard</h1>
            <p>Review and approve submitted documents before they go live.</p>
          </div>
        </div>

        <div className="content">
          {error && (
            <div className="error-banner">
              ⚠️ Error loading documents. Please refresh and try again.
            </div>
          )}

          {!error && documents?.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <h3>All caught up!</h3>
              <p>No pending documents to review right now.</p>
            </div>
          )}

          {documents && documents.length > 0 && (
            <>
              <p className="queue-label">{documents.length} pending review</p>
              {documents.map((doc) => (
                <AdminActions key={doc.id} doc={doc} />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}