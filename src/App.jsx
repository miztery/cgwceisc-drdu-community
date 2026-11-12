
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  Image,
  FileText,
  MessageCircle,
  LockKeyhole,
  ArrowRight,
  Menu,
  X,
  Anchor,
  LogOut,
  LoaderCircle,
  AlertCircle
} from "lucide-react";

import {
  signInWithGoogle,
  signOutUser,
  observeAuthState
} from "./firebase";

import "./style.css";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = observeAuthState((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setAuthError("The sign-in window was closed before completing.");
      } else if (error.code === "auth/popup-blocked") {
        setAuthError("Your browser blocked the sign-in window. Allow pop-ups and try again.");
      } else if (error.code === "auth/unauthorized-domain") {
        setAuthError("This website domain is not authorized in Firebase Authentication.");
      } else if (error.code === "auth/operation-not-allowed") {
        setAuthError("Google Sign-In is not enabled in Firebase.");
      } else {
        setAuthError(error.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthError("");

    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign-out error:", error);
      setAuthError("Unable to sign out. Please try again.");
    }
  };

  const features = [
    {
      icon: Users,
      title: "Community Network",
      description:
        "Connect and stay updated with fellow members of the CGWCEISC-DRDU community."
    },
    {
      icon: MessageCircle,
      title: "Community Discussions",
      description:
        "Share ideas, exchange information, and participate in community discussions."
    },
    {
      icon: Image,
      title: "Photo Galleries",
      description:
        "Explore shared photographs and memorable community activities."
    },
    {
      icon: FileText,
      title: "Document Sharing",
      description:
        "Access shared documents and community resources."
    }
  ];

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <div className="brand-logo">
            <Anchor size={27} />
          </div>
          <div className="brand-text">
            <strong>CGWCEISC-DRDU</strong>
            <span>COMMUNITY</span>
          </div>
        </a>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a
            href="#access"
            className="nav-button"
            onClick={() => setMenuOpen(false)}
          >
            Member Access <ArrowRight size={16} />
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <ShieldCheck size={16} />
              OFFICIAL COMMUNITY PLATFORM
            </div>

            <h1>
              Connected by Service.
              <span> United as One Community.</span>
            </h1>

            <p>
              Welcome to the CGWCEISC-DRDU Community — a dedicated
              online space for members to connect, share information,
              exchange ideas, and stay informed.
            </p>

            <div className="hero-actions">
              <a href="#access" className="primary-button">
                Access Community <ArrowRight size={18} />
              </a>
              <a href="#about" className="secondary-button">
                Learn More
              </a>
            </div>

            <div className="hero-note">
              <LockKeyhole size={15} />
              Secure access for authorized community members
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-emblem">
                <Anchor size={66} />
              </div>
              <div className="visual-divider"></div>
              <strong>CGWCEISC-DRDU</strong>
              <span>COMMUNITY NETWORK</span>
              <div className="visual-caption">
                CONNECT · SHARE · COLLABORATE
              </div>
            </div>

            <div className="floating-label">
              <ShieldCheck size={18} />
              Private Member Community
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="section-heading">
            <span className="section-label">WELCOME</span>
            <h2>A Shared Space for Our Community</h2>
            <p>
              Bringing members together through communication,
              collaboration, and shared resources.
            </p>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-label">PLATFORM FEATURES</span>
            <h2>Everything in One Community</h2>
            <p>
              Tools designed to make information sharing and
              community engagement easier.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="access-section" id="access">
          <div className="access-card">
            <div className="access-icon">
              <LockKeyhole size={30} />
            </div>

            <span className="section-label">MEMBER ACCESS</span>
            <h2>Your Community Starts Here</h2>

            <p>
              Sign in with your authorized Google account to access
              the community platform. New members will be subject
              to administrator approval.
            </p>

            {user ? (
              <div style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "12px",
                background: "#f3f6fa",
                textAlign: "center"
              }}>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginBottom: "12px"
                    }}
                  />
                )}

                <h3 style={{ margin: "0 0 6px" }}>
                  Welcome, {user.displayName || "Community Member"}!
                </h3>

                <p style={{ margin: "0 0 16px", overflowWrap: "anywhere" }}>
                  {user.email}
                </p>

                <p style={{ fontSize: "13px", marginBottom: "16px" }}>
                  Google authentication successful. Membership approval
                  will be checked separately.
                </p>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="google-button"
                  style={{ justifyContent: "center" }}
                >
                  <LogOut size={19} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "wait" : "pointer"
                }}
              >
                {loading ? (
                  <LoaderCircle size={20} className="spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.47-4.72 7.16l7.64 5.92c4.46-4.12 7.12-10.2 7.12-17.55z"/>
                    <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.9l-7.64-5.92c-2.12 1.42-4.84 2.27-8.26 2.27-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                )}

                {loading ? "Signing in..." : "Continue with Google"}
              </button>
            )}

            {authError && (
              <div
                role="alert"
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fff1f0",
                  color: "#b42318",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  textAlign: "left"
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                {authError}
              </div>
            )}

            <div className="access-note">
              <ShieldCheck size={15} />
              New registrations require administrator approval.
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <Anchor size={20} />
          <strong>CGWCEISC-DRDU COMMUNITY</strong>
        </div>

        <p>
          Connecting members. Sharing knowledge. Strengthening our community.
        </p>

        <span>
          © {new Date().getFullYear()} CGWCEISC-DRDU. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
