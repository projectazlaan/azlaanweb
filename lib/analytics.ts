// =============================================================
// lib/analytics.ts — GA4 Event Tracking Implementation
// =============================================================

type EventName = 
  | 'view_item_list' 
  | 'view_item' 
  | 'add_to_cart' 
  | 'begin_checkout' 
  | 'add_to_cart_bundle' 
  | 'select_item' 
  | 'quick_view'
  | 'filter_applied'
  | 'search';

interface EventParams {
  [key: string]: any;
}

export const trackEvent = (eventName: EventName, params: EventParams = {}) => {
  // Console logging for debugging (as requested)
  console.log(`[Analytics] Event: ${eventName}`, params);

  // Simulate GA4 event push
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};

export const trackPageView = (url: string) => {
  console.log(`[Analytics] Page View: ${url}`);
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-XXXXXXXXXX', {
      page_path: url,
    });
  }
};
