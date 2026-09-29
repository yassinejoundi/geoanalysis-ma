export const defaultGoogleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.320863649484!2d-8.0469745!3d31.6797952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafeb0073fed14b%3A0x81d2e6ae6e89d670!2sGeoanalysis%20engineering%20office!5e0!3m2!1sen!2s!4v1790691256466!5m2!1sen!2s";

export function getGoogleMapsEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "www.google.com" && url.pathname === "/maps/embed") {
      return url.href;
    }
  } catch {
    // Short share links are not embeddable; use the configured office map.
  }

  return defaultGoogleMapsEmbedUrl;
}
