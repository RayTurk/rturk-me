'use client';

/** Footer link that re-opens the consent banner. */
export default function CookiePrefsLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-consent-banner'))}
      className="hover:text-ion"
    >
      cookies
    </button>
  );
}
