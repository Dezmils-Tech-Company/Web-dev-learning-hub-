import React from 'react';
import { X, Shield, Scale, Mail, Users, CheckCircle, MapPin, Phone } from 'lucide-react';

interface FooterDocumentModalProps {
  documentType: string;
  onClose: () => void;
}

export default function FooterDocumentModal({ documentType, onClose }: FooterDocumentModalProps) {
  // Prevent background scrolling when open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderContent = () => {
    switch (documentType) {
      case 'terms':
        return (
          <div className="space-y-6 font-sans text-gray-700" id="terms-content">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Scale className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-950">Terms of Service</h3>
            </div>
            <p className="text-xs text-gray-500 font-mono">Last Updated: June 3, 2026 | Effective Immediately</p>
            
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">1. Acceptance of Terms</h4>
              <p className="text-sm leading-relaxed">
                Welcome to Dezmils Software Academy. By accessing or using our interactive Learning Management System (LMS), personal portfolio compilers, and academic practice environments, you agree to be bound by these Terms of Service. If you do not agree, you must immediately cease all operations on the applet.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">2. Code Construction & Training Mechanics</h4>
              <p className="text-sm leading-relaxed">
                Our curriculum focuses on line-by-line understanding, core structural markup, state-flow management, and backend API design. While our codeboxes utilize modern assistive syntax tools and helper macro panels, we promote genuine instruction integrity. You are sole custodian of your educational accomplishments.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">3. User Credentials & Gamified Valuation</h4>
              <p className="text-sm leading-relaxed">
                XP (Experience Points), consecutive login streaks, and competency badges awarded inside Dezmils Software Academy are designed for educational growth, tactile reinforcement, and personal gamified evaluation. These metrics represent academic progression criteria and carry zero monetary value.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">4. Interactive System & Content Use</h4>
              <p className="text-sm leading-relaxed">
                All platform components, interactive AI mentoring modules, simulated forums, curriculum guides, and layout challenges are owned by or licensed to Dezmils Academy. Users are allowed a personal, limited, revocable, non-transferable license to access challenges for personal engineering development.
              </p>
            </section>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6 font-sans text-gray-700" id="privacy-content">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Shield className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-950">Privacy Policy</h3>
            </div>
            <p className="text-xs text-gray-500 font-mono">Last Updated: June 3, 2026 | Safe & Local Isolation Policy</p>
            
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">1. Information We Collect</h4>
              <p className="text-sm leading-relaxed">
                Your privacy is paramount. Dezmils Software Academy operates with localized browser data architectures. We store your academy course completion logs, current learning track preferences, XP gains, earned achievements, and cumulative session streaks safely inside your local client-side memory (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs">localStorage</code>).
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">2. Zero Analytics & No Selling Data</h4>
              <p className="text-sm leading-relaxed">
                We do not integrate sneaky third-party surveillance scripts, trackers, or marketing pixels. Your developmental workspace remains isolated, focused, and free of spyware. Your profile details and code exercises are never packaged, rented, or sold to external aggregators.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">3. Mentorship Chat Processing</h4>
              <p className="text-sm leading-relaxed">
                Your queries with our interactive AI Mentorship Agent are processed securely using backend server endpoints to fetch intelligent tips and instructions. No code projects or text entries are permanently logged onto cloud storage servers beyond standard contextual generation demands.
              </p>
            </section>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6 font-sans text-gray-700" id="contact-content">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Mail className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-950">Contact Us</h3>
            </div>
            <p className="text-xs text-gray-500 font-mono">Get in Touch with Dezmils Support & Academy Administration</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg shrink-0 mt-0.5 border border-orange-100">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono text-gray-500 uppercase">General & Admissions</h5>
                    <p className="text-sm text-gray-950 font-medium">admissions@dezmils.com</p>
                    <p className="text-xxs text-gray-500 mt-0.5">Response times range between 12 to 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg shrink-0 mt-0.5 border border-orange-100">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono text-gray-500 uppercase">Academy Headquarters</h5>
                    <p className="text-sm text-gray-950 font-medium">Dezmils Tech Labs, Suite 402</p>
                    <p className="text-xs text-gray-650">Nairobi Dev District, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg shrink-0 mt-0.5 border border-orange-100">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-mono text-gray-500 uppercase">Office Calls</h5>
                    <p className="text-sm text-gray-950 font-medium">+254 700 DEZMILS</p>
                    <p className="text-xxs text-gray-500 mt-0.5">Mon - Fri, 9:00 AM to 5:00 PM UTC+3</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-150">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Leave a Direct Note</h4>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message was received securely by our Admissions Office."); onClose(); }}>
                  <div>
                    <label className="block text-xxs font-mono font-bold text-gray-500 uppercase mb-1">Your Full Name</label>
                    <input required type="text" placeholder="Jane Doe" className="w-full text-xs font-sans rounded border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input required type="email" placeholder="jane@example.com" className="w-full text-xs font-sans rounded border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xxs font-mono font-bold text-gray-500 uppercase mb-1">Inquiry Description</label>
                    <textarea required placeholder="How can the admissions or engineering mentors help you?" rows={3} className="w-full text-xs font-sans rounded border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full rounded bg-orange-600 text-white font-semibold font-sans py-2 text-xs hover:bg-orange-700 transition-colors cursor-pointer shadow-xs">
                    Send Inquiry Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="space-y-6 font-sans text-gray-700" id="community-content">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Users className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-950">Community Guidelines</h3>
            </div>
            <p className="text-xs text-gray-500 font-mono">Last Updated: June 3, 2026 | Constructive Dev Etiquette</p>
            
            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">1. Proactive Dev Mentality</h4>
              <p className="text-sm leading-relaxed">
                Dezmils Software Academy is built on active code construction, trial-and-error, and custom layouts. Support each other in peer forums. Help classmates debug logical race conditions, component hooks, layout offsets, and server controllers by providing constructive peer peer feedback.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">2. Respectful Peer Engagement</h4>
              <p className="text-sm leading-relaxed">
                Treat fellow peers with respect, empathy, and professional developer decorum. No harassment, abusive behavior, or toxic comments are tolerated inside our simulated Classmate Peer Forum.
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-bold text-gray-950">3. Maintain Safe Forums</h4>
              <p className="text-sm leading-relaxed">
                Keep the class forum safe from spam, advertising links, off-topic postings, or credential sharing. Maintain high-quality sample listings and focus posts on solving CSS grids, React hooks, Express endpoints, or SQL queries.
              </p>
            </section>

            <section className="space-y-3 bg-orange-50/50 border border-orange-100 rounded-lg p-4 mt-6">
              <div className="flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 text-orange-600 shrink-0" />
                <span className="text-xs font-bold text-orange-950">Dezmils Member Agreement</span>
              </div>
              <p className="text-xs text-orange-900 leading-relaxed">
                By entering developer discussions or interacting on the practice channels, you agree to stay collaborative and honor the path of continuous, original code craftsmanship.
              </p>
            </section>
          </div>
        );
      default:
        return <p className="text-sm text-gray-600">No document found.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs transition-all duration-300 animate-fadeIn" id="footer-doc-modal">
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden transform scale-100 animate-scaleIn">
        {/* Modal Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1.5 transition-all cursor-pointer focus:outline-none"
          title="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Container with Content spacing */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {renderContent()}
        </div>

        {/* Footer actions */}
        <div className="bg-gray-50 border-t border-gray-150 px-6 py-4 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="rounded bg-gray-900 text-white font-semibold font-sans px-5 py-2 text-xs hover:bg-gray-800 transition-colors cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
