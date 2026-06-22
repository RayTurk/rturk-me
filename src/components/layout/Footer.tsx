import Link from 'next/link';
import CookiePrefsLink from '@/components/consent/CookiePrefsLink';

const github = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/RayTurk';
const linkedin =
  process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/raymond-turk-625097137';

const SITEMAP = [
  { href: '/work', label: 'work' },
  { href: '/writing', label: 'writing' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
];

const SERVICES = ['Web Development', 'Hosting & Maintenance', 'Performance & SEO Audits', 'Consulting'];

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="font-display text-5xl font-semibold tracking-tight text-signal md:text-7xl">
          RAY TURK
        </p>
        <div className="mt-10 grid grid-cols-2 gap-8 font-mono text-sm text-muted md:grid-cols-3">
          <ul className="space-y-2">
            {SITEMAP.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ion">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-xs text-faint">
          <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
          <div className="flex gap-4">
            <a href={github} className="hover:text-ion">github</a>
            <a href={linkedin} className="hover:text-ion">linkedin</a>
            <Link href="/colophon" className="hover:text-ion">colophon</Link>
            <CookiePrefsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
