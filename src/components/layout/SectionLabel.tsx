interface Props {
  label: string;
  number?: string;
}

export default function SectionLabel({ label, number }: Props) {
  return (
    <div className="relative">
      <p className="font-mono text-xs text-faint">// {label}</p>
      {number && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 select-none font-display text-[8rem] font-black leading-none text-signal/[0.05]"
        >
          {number}
        </span>
      )}
    </div>
  );
}
