import { useEffect } from "react";
import { useLocation } from "wouter";

// Google Analytics Measurement ID
// Replace with your actual GA4 Measurement ID (e.g., "G-XXXXXXXXXX")
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

export default function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    // Only load GA if measurement ID is provided
    if (!GA_MEASUREMENT_ID) {
      console.warn("Google Analytics Measurement ID not configured");
      return;
    }

    // Load Google Analytics script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);

    // Make gtag available globally
    (window as any).gtag = gtag;

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script);
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !(window as any).gtag) return;

    (window as any).gtag("event", "page_view", {
      page_path: location,
      page_title: document.title,
    });
  }, [location]);

  return null; // This component doesn't render anything
}

// Helper function to track custom events
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (!(window as any).gtag) {
    console.warn("Google Analytics not initialized");
    return;
  }

  (window as any).gtag("event", eventName, eventParams);
}

// Helper function to track conversions
export function trackConversion(
  conversionLabel: string,
  value?: number,
  currency: string = "BRL"
) {
  trackEvent("conversion", {
    send_to: conversionLabel,
    value: value,
    currency: currency,
  });
}

// Helper function to track purchases
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string = "BRL",
  items?: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity?: number;
  }>
) {
  trackEvent("purchase", {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}
