'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={styles.container}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2>📚 Resource Hub</h2>

        <div style={styles.navLinks}>
          <Link href="/documents" style={styles.navLink}>
            Browse
          </Link>

          <Link href="/upload" style={styles.navLink}>
            Upload
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Discover, Share & Learn
        </h1>

        <p style={styles.subtitle}>
          Access past papers, study guides, assignments and
          educational resources shared by students and educators.
        </p>

        <div style={styles.bullets}>
          <span>✓ Upload Documents</span>
          <span>✓ Verified Resources</span>
          <span>✓ Community Ratings</span>
          <span>✓ Fast Search</span>
        </div>

        <div style={styles.actions}>
          <Link href="/upload">
            <button style={styles.primaryButton}>
              📤 Upload Document
            </button>
          </Link>

          <Link href="/documents">
            <button style={styles.secondaryButton}>
              📄 Browse Library
            </button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={styles.stats}>
        <div style={styles.statCard}>
          <h3>📄 Documents</h3>
          <p style={styles.statNumber}>25</p>
        </div>

        <div style={styles.statCard}>
          <h3>✅ Verified</h3>
          <p style={styles.statNumber}>20</p>
        </div>

        <div style={styles.statCard}>
          <h3>⭐ Ratings</h3>
          <p style={styles.statNumber}>67</p>
        </div>

        <div style={styles.statCard}>
          <h3>🚨 Reports</h3>
          <p style={styles.statNumber}>12</p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Features</h2>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <h3>📤 Upload Resources</h3>
            <p>
              Share notes, assignments, papers and study guides
              with the community.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>✅ Verification System</h3>
            <p>
              Highlight trusted resources and improve content quality.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>⭐ Community Ratings</h3>
            <p>
              Discover the highest-rated educational resources.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <h3>1️⃣ Upload</h3>
            <p>
              Submit study guides, notes and educational resources.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>2️⃣ Review</h3>
            <p>
              Community members rate and report resources.
            </p>
          </div>

          <div style={styles.featureCard}>
            <h3>3️⃣ Learn</h3>
            <p>
              Quickly find trusted resources for your studies.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>📚 Resource Hub © 2026</p>
        <p>Built for students, by students.</p>
      </footer>

    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '30px',
    color: 'white',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    background:
      'linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e3a8a 100%)'
  },

  navbar: {
    maxWidth: '1200px',
    margin: '0 auto 60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  navLinks: {
    display: 'flex',
    gap: '20px'
  },

  navLink: {
    color: '#cbd5e1',
    textDecoration: 'none'
  },

  hero: {
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '60px 0'
  },

  title: {
    fontSize: '64px',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '20px'
  },

  subtitle: {
    fontSize: '22px',
    color: '#cbd5e1',
    maxWidth: '700px',
    margin: '0 auto 30px'
  },

  bullets: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '40px',
    color: '#94a3b8'
  },

  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },

  primaryButton: {
    background: 'linear-gradient(135deg,#2563eb,#3b82f6)',
    color: 'white',
    padding: '15px 28px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 10px 30px rgba(37,99,235,0.4)'
  },

  secondaryButton: {
    background: 'rgba(30,41,59,0.8)',
    color: 'white',
    padding: '15px 28px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px'
  },

  stats: {
    maxWidth: '1200px',
    margin: '50px auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: '20px'
  },

  statCard: {
    background: 'rgba(30,41,59,0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '25px',
    textAlign: 'center'
  },

  statNumber: {
    fontSize: '32px',
    fontWeight: '700'
  },

  section: {
    maxWidth: '1200px',
    margin: '80px auto'
  },

  sectionTitle: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '36px'
  },

  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
    gap: '20px'
  },

  featureCard: {
    background: 'rgba(30,41,59,0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '25px'
  },

  footer: {
    marginTop: '100px',
    textAlign: 'center',
    color: '#94a3b8',
    paddingBottom: '30px'
  }
}