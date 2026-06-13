'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PAGES = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/writing' },
  { label: 'About', href: '/about' },
  { label: 'Colophon', href: '/colophon' },
  { label: 'Contact', href: '/contact' },
];

const LINKS = [
  { label: 'GitHub', href: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/RayTurk' },
  { label: 'LinkedIn', href: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/raymond-turk-cle' },
];

const EMAIL = 'rturk.me@gmail.com';

/**
 * Global ⌘K / Ctrl-K command palette. Navigates pages, opens socials, copies
 * the contact email. Mounted once in the root layout.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function onToggle() {
      setOpen((o) => !o);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('command-palette:toggle', onToggle);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('command-palette:toggle', onToggle);
    };
  }, []);

  function go(href: string) {
    setOpen(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      router.push(href);
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-void/70 p-4 pt-[18vh] backdrop-blur"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-hairline bg-panel shadow-2xl">
        <Command.Input
          placeholder="Type a command or search…"
          className="w-full border-b border-hairline bg-transparent px-4 py-3 font-mono text-sm text-signal outline-none placeholder:text-faint"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center font-mono text-xs text-faint">
            No results.
          </Command.Empty>
          <Command.Group heading="Pages" className="px-1 font-mono text-[10px] uppercase tracking-wider text-faint">
            {PAGES.map((p) => (
              <Command.Item
                key={p.href}
                onSelect={() => go(p.href)}
                className="cursor-pointer rounded-md px-3 py-2 font-sans text-sm text-muted data-[selected=true]:bg-void data-[selected=true]:text-ion"
              >
                {p.label}
              </Command.Item>
            ))}
          </Command.Group>
          <Command.Group heading="Links" className="mt-2 px-1 font-mono text-[10px] uppercase tracking-wider text-faint">
            {LINKS.map((l) => (
              <Command.Item
                key={l.href}
                onSelect={() => go(l.href)}
                className="cursor-pointer rounded-md px-3 py-2 font-sans text-sm text-muted data-[selected=true]:bg-void data-[selected=true]:text-ion"
              >
                {l.label} ↗
              </Command.Item>
            ))}
            <Command.Item
              onSelect={() => {
                navigator.clipboard?.writeText(EMAIL);
                setOpen(false);
              }}
              className="cursor-pointer rounded-md px-3 py-2 font-sans text-sm text-muted data-[selected=true]:bg-void data-[selected=true]:text-ion"
            >
              Copy email
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
