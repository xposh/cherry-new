import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <main>
      {/* Diese Datei kannst Du verwenden, um zB Navigation oder Footer einzubauen, die auf jeder Seite gleich sind */}
      <h2>Ich bin das Layout</h2>

      <Outlet />
      <nav className="fixed bottom-0 w-full">
        <ul className="flex justify-center p-4 bg-green-700 text-white gap-4">
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
