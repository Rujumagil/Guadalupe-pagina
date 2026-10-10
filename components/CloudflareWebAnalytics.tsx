import Script from "next/script";

const CLOUDFLARE_WEB_ANALYTICS_TOKEN = "6981a06da5964f7ba3dfdb30cef6e2c0";

export function CloudflareWebAnalytics() {
  return (
    <Script
      id="cloudflare-web-analytics"
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token: CLOUDFLARE_WEB_ANALYTICS_TOKEN })}
    />
  );
}
