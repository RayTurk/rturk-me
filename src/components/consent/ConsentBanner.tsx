'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

const CONSENT_KEY = 'cookie-consent';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

type ConsentValue = 'accepted' | 'declined' | null;

function injectGTM() {
  if (!GTM_ID || document.getElementById('gtm-script')) return;
  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;
  document.head.appendChild(script);
}

/** Cookie consent banner. GTM loads ONLY after the user accepts. The footer's
 *  "cookies" link re-opens it via the `open-consent-banner` event. */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue;
    if (stored === 'accepted') {
      injectGTM();
    } else if (stored === null) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('open-consent-banner', handler);
    return () => window.removeEventListener('open-consent-banner', handler);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    injectGTM();
  }
  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-hairline bg-panel px-5 py-4 shadow-2xl sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ion">
                Cookie preferences
              </p>
              <p className="text-sm leading-relaxed text-muted">
                This site uses analytics cookies to understand how visitors use it. No personal
                data is sold.{' '}
                <Link href="/privacy" className="text-ion underline underline-offset-2">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              <button
                onClick={decline}
                className="rounded-lg border border-hairline px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-signal"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="rounded-lg bg-ion px-4 py-2 text-sm font-semibold text-void transition-opacity hover:opacity-90"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
