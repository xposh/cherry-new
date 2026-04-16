// 1. IMPORT: Wir holen die 'WelcomeSlides' aus dem pages-Ordner.
// Warum? Damit App.tsx weiß, was sie anzeigen soll.
import { WelcomeSlides } from './pages/WelcomeSlides';

export default function App() {
  // 2. RETURN: Hier entscheiden wir, was der User sieht.
  // Warum hier? Später bauen wir hier den 'Router' ein, der 
  // zwischen OpenerPage und WelcomeSlides umschaltet.
  return (
    <main>
      <WelcomeSlides />
    </main>
  );
}