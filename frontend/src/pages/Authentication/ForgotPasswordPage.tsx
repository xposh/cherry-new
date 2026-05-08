// 1. IMPORT-BEREICH
import { useState } from 'react';
import { Link } from 'react-router';
import { Logo } from '../../components/Logo';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hier würde der API-Call an dein Backend gehen
    console.log('Reset-Link an:', email);
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden font-sans">
      <Logo />


      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {!submitted ? (
          <>
            <div className="mb-12">
              <h1 className="tracking-[0.3em] uppercase font-light text-[14px] text-[#2A6087]">
                Reset Password
              </h1>
              <p className="text-[#808080] text-xs mt-4 leading-relaxed">
                Gib deine E-Mail Adresse ein. Wir senden dir einen Link, um dein Passwort sicher zurückzusetzen.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-transparent border border-white/30 text-white rounded-none outline-none focus:border-[#2A6087] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white/10 hover:bg-[#2A6087]/50 text-white font-light uppercase tracking-[0.3em] border border-white/20 transition-all text-[14px]"
              >
                Link anfordern
              </button>
            </form>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center space-y-6">
            <h2 className="text-white tracking-widest uppercase font-light">Check dein Postfach</h2>
            <p className="text-[#808080] text-sm">
              Wir haben eine Nachricht an <b>{email}</b> geschickt.
            </p>
            <Link to="/login" className="block text-[#2A6087] uppercase text-[10px] tracking-widest hover:underline pt-4">
              Zurück zum Login
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/login" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
            Abbrechen
          </Link>
        </div>
      </div>
    </div>
  );
}