'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

export default function HomePage() {
  const [stats, setStats] = useState({
    documents: null,
    verified: null,
    ratings: null,
  })

  useEffect(() => {
    async function fetchStats() {
      const [{ count: documents }, { count: verified }, { count: ratings }] = await Promise.all([
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('verified', true),
        supabase.from('ratings').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        documents: documents ?? 0,
        verified: verified ?? 0,
        ratings: ratings ?? 0,
      })
    }

    fetchStats()
  }, [])

  function StatNumber({ value }) {
    if (value === null) {
      return <div className="stat-number stat-loading">—</div>
    }
    return <div className="stat-number">{value.toLocaleString()}</div>
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f9f9f7; color: #111; }

        .nav {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 0 60px;
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
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          color: #555;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 100px;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: #f5f5f3; color: #111; }
        .nav-cta { background: #111; color: #fff !important; padding: 10px 20px !important; }
        .nav-cta:hover { background: #333 !important; }

        .hero {
          background: #fff;
          border-bottom: 1px solid #ebebeb;
          padding: 100px 60px;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 28px;
        }
        .hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: 64px;
          font-weight: 800;
          color: #111;
          line-height: 1.1;
          max-width: 800px;
          margin: 0 auto 20px;
          letter-spacing: -1.5px;
        }
        .hero h1 span { color: #2563eb; }
        .hero p {
          font-size: 18px;
          color: #666;
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 60px;
        }
        .btn-primary {
          background: #111;
          color: #fff;
          padding: 15px 28px;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s;
        }
        .btn-primary:hover { background: #333; }
        .btn-secondary {
          background: #fff;
          color: #111;
          padding: 15px 28px;
          border: 1.5px solid #e0e0e0;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: border-color 0.15s;
        }
        .btn-secondary:hover { border-color: #111; }
        .hero-bullets {
          display: flex;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
          color: #888;
          font-size: 14px;
          font-weight: 500;
        }
        .hero-bullets span { display: flex; align-items: center; gap: 6px; }
        .hero-bullets span::before { content: '✓'; color: #16a34a; font-weight: 700; }

        .stats-section { background: #f9f9f7; padding: 60px; }
        .stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .stat-card {
          background: #fff;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
          transition: box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .stat-icon { font-size: 28px; margin-bottom: 10px; }
        .stat-number {
          font-family: 'Sora', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #111;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-loading {
          color: #ddd;
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .stat-label { font-size: 13px; color: #888; font-weight: 500; }

        .features-section {
          padding: 80px 60px;
          background: #fff;
          border-top: 1px solid #ebebeb;
          border-bottom: 1px solid #ebebeb;
        }
        .section-label {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #2563eb;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Sora', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #111;
          text-align: center;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }
        .features-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .feature-card {
          background: #f9f9f7;
          border: 1.5px solid #ebebeb;
          border-radius: 16px;
          padding: 28px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .feature-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.07); transform: translateY(-2px); }
        .feature-icon {
          width: 48px;
          height: 48px;
          background: #111;
          color: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 16px;
        }
        .feature-card h3 { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 700; color: #111; margin-bottom: 8px; }
        .feature-card p { font-size: 14px; color: #666; line-height: 1.6; }

        .how-section { padding: 80px 60px; background: #f9f9f7; }
        .steps-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .step-card { background: #fff; border: 1.5px solid #ebebeb; border-radius: 16px; padding: 32px 24px; text-align: center; }
        .step-number {
          width: 44px;
          height: 44px;
          background: #111;
          color: #fff;
          border-radius: 100px;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .step-card h3 { font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #111; }
        .step-card p { font-size: 14px; color: #666; line-height: 1.6; }

        .cta-section { background: #111; padding: 80px 60px; text-align: center; }
        .cta-section h2 { font-family: 'Sora', sans-serif; font-size: 40px; font-weight: 800; color: #fff; margin-bottom: 16px; letter-spacing: -0.5px; }
        .cta-section p { color: #aaa; font-size: 16px; margin-bottom: 32px; }
        .btn-white {
          background: #fff;
          color: #111;
          padding: 15px 32px;
          border: none;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.15s;
        }
        .btn-white:hover { opacity: 0.9; }

        .footer {
          background: #fff;
          border-top: 1px solid #ebebeb;
          padding: 32px 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-logo { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 16px; color: #111; }
        .footer-copy { font-size: 13px; color: #aaa; }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { font-size: 13px; color: #888; text-decoration: none; transition: color 0.15s; }
        .footer-links a:hover { color: #111; }

        @media (max-width: 900px) {
          .nav { padding: 0 20px; }
          .hero { padding: 60px 20px; }
          .hero h1 { font-size: 40px; }
          .stats-section { padding: 40px 20px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-section, .how-section, .cta-section { padding: 60px 20px; }
          .features-grid, .steps-grid { grid-template-columns: 1fr; }
          .footer { padding: 24px 20px; flex-direction: column; text-align: center; }
        }
      `}</style>

      <div>
        <nav className="nav">
          <Link className="nav-logo" href="/">
            <span className="nav-logo-icon">📚</span>
            ResourceHub
          </Link>
          <div className="nav-links">
            <Link className="nav-link" href="/documents">Browse</Link>
            <Link className="nav-link nav-cta" href="/upload">Upload</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-badge">✦ Free educational resources for SA students</div>
          <h1>Discover, Share<br />& <span>Learn Together</span></h1>
          <p>Access past papers, study guides, assignments and educational resources shared by students and educators across South Africa.</p>
          <div className="hero-actions">
            <Link className="btn-primary" href="/upload">📤 Upload Document</Link>
            <Link className="btn-secondary" href="/documents">📄 Browse Library</Link>
          </div>
          <div className="hero-bullets">
            <span>Upload Documents</span>
            <span>Verified Resources</span>
            <span>Community Ratings</span>
            <span>Fast Search</span>
          </div>
        </section>

        {/* REAL-TIME STATS */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📄</div>
              <StatNumber value={stats.documents} />
              <div className="stat-label">Documents</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <StatNumber value={stats.verified} />
              <div className="stat-label">Verified</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <StatNumber value={stats.ratings} />
              <div className="stat-label">Ratings</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Students</div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="section-label">Why ResourceHub</div>
          <h2 className="section-title">Everything you need to study smarter</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3>Upload Resources</h3>
              <p>Share notes, assignments, past papers and study guides with the student community.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verification System</h3>
              <p>All documents are reviewed before going live, ensuring quality and trusted content.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Community Ratings</h3>
              <p>Discover the highest-rated educational resources rated by fellow students.</p>
            </div>
          </div>
        </section>

        <section className="how-section">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">Three simple steps</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Upload</h3>
              <p>Submit your study guides, notes and educational resources in seconds.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Review</h3>
              <p>Our team reviews your submission and approves quality content.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Learn</h3>
              <p>Students find and download trusted resources for their studies.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to contribute?</h2>
          <p>Share your study materials and help thousands of students across South Africa.</p>
          <Link className="btn-white" href="/upload">Upload your first document →</Link>
        </section>

        <footer className="footer">
          <span className="footer-logo">📚 ResourceHub</span>
          <span className="footer-copy">© 2026 ResourceHub. Built for students, by students.</span>
          <div className="footer-links">
            <Link href="/documents">Library</Link>
            <Link href="/upload">Upload</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </footer>
      </div>
    </>
  )
}