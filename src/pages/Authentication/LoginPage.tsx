// 1. IMPORT-BEREICH
import { useState } from 'react';
// Link: Für die Navigation zurück zur Registrierung.
import { Link } from 'react-router';
// Logo: Deine zentrale Branding-Komponente.
import { Logo } from '../../components/Logo';

export function LoginPage() {
  // 2. STATE (Zustand)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. HANDLER (Logik-Funktionen)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    // 4. ARCHITEKTUR-GERÜST
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* 5. EBENE 1: HINTERGRUNDBILD */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-90 grayscale"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1745236549199-542fe7a368f4?q=80&w=1530&auto=format&fit=crop')"
        }}
      />

      {/* 6. EBENE 2: DUNKLES OVERLAY */}
      <div className="absolute inset-0 z-10 bg-black/40" /> 

      {/* 7. LOGO (Zentrale Komponente) */}
      <Logo />

      {/* 8. EBENE 3: CONTENT (FORMULAR) */}
      <div className="relative z-20 w-full max-w-md px-6 py-12">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* E-MAIL FELD */}
          <div>
            <label htmlFor="email" className="block text-sm mb-2 text-[#bababa]">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.de"
              required
              className="w-full px-4 py-3 bg-transparent border border-white text-white placeholder-[#808080] rounded-none focus:outline-none focus:border-[#2A6087] transition-colors"
            />
          </div>

          {/* PASSWORT FELD */}
          <div>
            <label htmlFor="password" className="block text-sm mb-2 text-[#bababa]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-transparent border border-white text-white placeholder-[#808080] rounded-none focus:outline-none focus:border-[#2A6087] transition-colors"
            />
          </div>

          {/* FORGOT PASSWORD */}
          <Link 
            to="/forgot-password" 
            className="hover:text-[#2A6087] transition-colors text-[9px] text-[#ffffffc7] uppercase tracking-widest"
          >
            Forgot Password?
          </Link>

          {/* LOGIN BUTTON (Standard HTML button statt UI-Komponente) */}
          <button
            type="submit"
            className="w-full border border-[#bababa] bg-black/50 hover:bg-[white]/50 hover:text-black py-4 rounded-none font-light text-white transition-all duration-300 tracking-[0.3em] uppercase text-[16px]"
          >
            Login
          </button>

          {/* TRENNLINIE (OR) */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#6f6f6f]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-[#bababa] bg-transparent">or</span>
            </div>
          </div>

          {/* GOOGLE LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-white bg-transparent hover:bg-white hover:text-black text-white text-base py-4 rounded-none transition-all duration-300 flex items-center font-bold justify-center gap-3 tracking-widest text-[14px]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
        </form>

        {/* REGISTRIERUNG LINK */}
        <div className="mt-8 text-center">
          <p className="text-[#808080] text-sm">
            No Account?{' '}
            <Link to="/signup" className="text-white hover:underline transition-all">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}