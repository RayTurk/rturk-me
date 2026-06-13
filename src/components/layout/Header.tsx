import Link from 'next/link';
import CommandKHint from './CommandKHint';

const nav = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/about', label: 'about' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-void/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold text-signal">
          rturk.me
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm text-muted">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-ion">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-lg bg-ion px-3 py-1.5 font-sans font-semibold text-void transition-opacity hover:opacity-90"
          >
            contact
          </Link>
          <CommandKHint />
        </nav>
      </div>
    </header>
  );
}
