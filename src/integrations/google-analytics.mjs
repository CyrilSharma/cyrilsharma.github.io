import fs from "node:fs";

export default function googleAnalytics({ measurementId, hostname }) {
  if (!measurementId) return { name: "google-analytics", hooks: {} };
  if (!/^G-[A-Z0-9]+$/.test(measurementId)) {
    throw new Error("Google Analytics requires a GA4 measurement ID (G-…).");
  }

  const tag = `<script id="google-analytics">
if (window.location.hostname === ${JSON.stringify(hostname)}) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', '${measurementId}', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  var analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
  document.head.appendChild(analyticsScript);
}
</script>`;

  return {
    name: "google-analytics",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        let pages = 0;
        for (const entry of fs.readdirSync(dir, { recursive: true })) {
          if (!entry.endsWith(".html")) continue;
          const file = new URL(entry, dir);
          const html = fs.readFileSync(file, "utf8");
          if (html.includes('id="google-analytics"')) continue;
          const tagged = html.replace(/<head(?:\s[^>]*)?>/i, `$&${tag}`);
          if (tagged === html) continue;
          fs.writeFileSync(file, tagged);
          pages++;
        }
        logger.info(`Added Google Analytics to ${pages} HTML pages.`);
      },
    },
  };
}
