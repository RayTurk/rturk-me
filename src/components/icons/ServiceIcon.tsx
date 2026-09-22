interface ServiceIconProps {
  variant: 'code' | 'server' | 'gauge' | 'chat' | 'check' | 'unlock' | 'search';
  className?: string;
}

const PATHS: Record<ServiceIconProps['variant'], React.ReactNode> = {
  code: (
    <path d="M9 8L5 12l4 4M15 8l4 4-4 4" />
  ),
  server: (
    <>
      <rect x="4" y="4.5" width="16" height="6" rx="1.5" />
      <rect x="4" y="13.5" width="16" height="6" rx="1.5" />
      <circle cx="7.5" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  gauge: (
    <>
      <path d="M4.5 16a7.5 7.5 0 1 1 15 0" />
      <path d="M12 16l3.5-4.5" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  chat: (
    <path d="M5 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8l-4.5 4v-4H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 12.5l2.7 2.7L16.5 9" />
    </>
  ),
  unlock: (
    <>
      <rect x="5.5" y="11" width="13" height="9" rx="1.5" />
      <path d="M9 11V8a3.5 3.5 0 0 1 6.7-1.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </>
  ),
};

export default function ServiceIcon({ variant, className }: ServiceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[variant]}
    </svg>
  );
}
