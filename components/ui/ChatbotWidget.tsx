'use client'
import Script from 'next/script'

// ── ChatbotWidget ────────────────────────────────────────────────────────────
// Supports: Tidio, Crisp, Tawk.to — set one env var in .env.local to activate
//
// Tidio (recommended — free, works well for dev blogs):
//   NEXT_PUBLIC_TIDIO_KEY=your_public_key
//
// Crisp (free up to 1 agent):
//   NEXT_PUBLIC_CRISP_ID=your_website_id
//
// Tawk.to (100% free):
//   NEXT_PUBLIC_TAWKTO_ID=your_property_id/widget_id
//   e.g. NEXT_PUBLIC_TAWKTO_ID=64abc123def/1hxxxxxxx
//
// Uses lazyOnload so it never blocks page load or LCP score.
// ────────────────────────────────────────────────────────────────────────────

const TIDIO_KEY   = process.env.NEXT_PUBLIC_TIDIO_KEY
const CRISP_ID    = process.env.NEXT_PUBLIC_CRISP_ID
const TAWKTO_ID   = process.env.NEXT_PUBLIC_TAWKTO_ID

export function ChatbotWidget() {
  // Tidio
  if (TIDIO_KEY) {
    return (
      <Script
        id="tidio-chat"
        src={`//code.tidio.co/${TIDIO_KEY}.js`}
        strategy="lazyOnload"
      />
    )
  }

  // Crisp
  if (CRISP_ID) {
    return (
      <Script id="crisp-chat" strategy="lazyOnload">{`
        window.$crisp=[];
        window.CRISP_WEBSITE_ID="${CRISP_ID}";
        (function(){
          var d=document;
          var s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";
          s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();
      `}</Script>
    )
  }

  // Tawk.to
  if (TAWKTO_ID) {
    const [propertyId, widgetId] = TAWKTO_ID.split('/')
    return (
      <Script id="tawkto-chat" strategy="lazyOnload">{`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src="https://embed.tawk.to/${propertyId}/${widgetId || '1'}";
          s1.charset="UTF-8";
          s1.setAttribute("crossorigin","*");
          s0.parentNode.insertBefore(s1,s0);
        })();
      `}</Script>
    )
  }

  // No chatbot configured — render nothing
  return null
}

