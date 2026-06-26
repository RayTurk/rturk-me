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
        <div className="text-center">
          <p
            className="font-display font-black leading-none tracking-tighter text-signal"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
          >
            RAY TURK
          </p>
          <p className="mt-2 font-mono text-xs text-faint">full-stack developer · cleveland, oh</p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-8 border-t border-hairline pt-8 font-mono text-sm text-muted">
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
          <ul className="space-y-2">
            <li>
              <a href={github} className="hover:text-ion">
                github
              </a>
            </li>
            <li>
              <a href={linkedin} className="hover:text-ion">
                linkedin
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 font-mono text-xs text-faint">
          <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
          <div className="flex gap-4">
            <Link href="/colophon" className="hover:text-ion">
              colophon
            </Link>
            <CookiePrefsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
