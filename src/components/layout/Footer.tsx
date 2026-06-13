import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8 font-mono text-xs text-faint">
        <span>© {new Date().getFullYear()} Ray Turk · Cleveland, OH</span>
        <div className="flex gap-4">
          <a href="https://github.com/RayTurk" className="hover:text-ion">github</a>
          <a href="https://www.linkedin.com/in/raymond-turk-cle" className="hover:text-ion">linkedin</a>
          <Link href="/colophon" className="hover:text-ion">colophon</Link>
        </div>
      </div>
    </footer>
  );
}
