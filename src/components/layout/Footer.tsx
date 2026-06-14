import Link from 'next/link';
import CookiePrefsLink from '@/components/consent/CookiePrefsLink';

const github = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/RayTurk';
const linkedin =
  process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/raymond-turk-625097137';

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8 font-mono text-xs text-faint">
        <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
        <div className="flex gap-4">
          <a href={github} className="hover:text-ion">github</a>
          <a href={linkedin} className="hover:text-ion">linkedin</a>
          <Link href="/colophon" className="hover:text-ion">colophon</Link>
          <CookiePrefsLink />
        </div>
      </div>
    </footer>
  );
}
