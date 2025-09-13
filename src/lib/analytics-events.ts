/**
 * Analytics Events Tracking
 * High-converting customer service automation landing page analytics
 */

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const trackEvent = (eventData: AnalyticsEvent) => {
  // Google Analytics 4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventData.action, {
      event_category: eventData.category,
      event_label: eventData.label,
      value: eventData.value,
      custom_event_name: eventData.event
    });
  }

  // Send to your backend analytics if needed
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(error => {
      console.error('Analytics tracking failed:', error);
    });
  }
};

// Landing Page Specific Events
export const ANALYTICS_EVENTS = {
  // Hero Section
  HERO_CTA_CLICK: {
    event: 'hero_cta_click',
    category: 'Landing Page',
    action: 'Click',
    label: 'Hero CTA Button'
  },
  DEMO_VIDEO_PLAY: {
    event: 'demo_video_play',
    category: 'Engagement',
    action: 'Play Video',
    label: 'Hero Demo Video'
  },

  // ROI Calculator
  ROI_CALCULATOR_OPEN: {
    event: 'roi_calculator_open',
    category: 'Lead Generation',
    action: 'Open Calculator',
    label: 'ROI Calculator Modal'
  },
  ROI_CALCULATOR_COMPLETE: {
    event: 'roi_calculator_complete',
    category: 'Lead Generation',
    action: 'Complete Calculation',
    label: 'ROI Calculator Results'
  },
  ROI_FORM_SUBMIT: {
    event: 'roi_form_submit',
    category: 'Conversion',
    action: 'Form Submit',
    label: 'ROI Calculator Contact Form'
  },

  // Integration Section
  INTEGRATION_CLICK: {
    event: 'integration_click',
    category: 'Features',
    action: 'Click Integration',
    label: 'Integration Icon'
  },
  VIEW_ALL_INTEGRATIONS: {
    event: 'view_all_integrations',
    category: 'Features',
    action: 'View All',
    label: 'Integration Marketplace'
  },
  CUSTOM_INTEGRATION_REQUEST: {
    event: 'custom_integration_request',
    category: 'Lead Generation',
    action: 'Request Custom Integration',
    label: 'Integration Expert CTA'
  },

  // Social Proof
  TESTIMONIAL_CLICK: {
    event: 'testimonial_click',
    category: 'Social Proof',
    action: 'Click Testimonial',
    label: 'Customer Testimonial'
  },
  CASE_STUDY_VIEW: {
    event: 'case_study_view',
    category: 'Social Proof',
    action: 'View Case Study',
    label: 'Client Success Story'
  },

  // Pricing Section
  PRICING_CTA_CLICK: {
    event: 'pricing_cta_click',
    category: 'Conversion',
    action: 'Pricing CTA Click',
    label: 'Get Started Button'
  },
  SCHEDULE_DEMO_CLICK: {
    event: 'schedule_demo_click',
    category: 'Lead Generation',
    action: 'Schedule Demo',
    label: 'Demo Request Button'
  },

  // FAQ Section
  FAQ_EXPAND: {
    event: 'faq_expand',
    category: 'Engagement',
    action: 'Expand FAQ',
    label: 'FAQ Question'
  },

  // Scroll Tracking
  SCROLL_25: {
    event: 'scroll_depth',
    category: 'Engagement',
    action: 'Scroll 25%',
    label: 'Page Scroll Depth'
  },
  SCROLL_50: {
    event: 'scroll_depth',
    category: 'Engagement',
    action: 'Scroll 50%',
    label: 'Page Scroll Depth'
  },
  SCROLL_75: {
    event: 'scroll_depth',
    category: 'Engagement',
    action: 'Scroll 75%',
    label: 'Page Scroll Depth'
  },
  SCROLL_100: {
    event: 'scroll_depth',
    category: 'Engagement',
    action: 'Scroll 100%',
    label: 'Page Scroll Depth'
  },

  // Time on Page
  TIME_ON_PAGE_30S: {
    event: 'time_on_page',
    category: 'Engagement',
    action: '30 Seconds',
    label: 'Page Engagement Time'
  },
  TIME_ON_PAGE_60S: {
    event: 'time_on_page',
    category: 'Engagement',
    action: '60 Seconds',
    label: 'Page Engagement Time'
  },
  TIME_ON_PAGE_120S: {
    event: 'time_on_page',
    category: 'Engagement',
    action: '120 Seconds',
    label: 'Page Engagement Time'
  },

  // Contact Forms
  CONTACT_FORM_START: {
    event: 'contact_form_start',
    category: 'Lead Generation',
    action: 'Start Form',
    label: 'Contact Form'
  },
  CONTACT_FORM_COMPLETE: {
    event: 'contact_form_complete',
    category: 'Conversion',
    action: 'Complete Form',
    label: 'Contact Form Submission'
  },

  // Exit Intent
  EXIT_INTENT_POPUP: {
    event: 'exit_intent_popup',
    category: 'Lead Generation',
    action: 'Exit Intent Triggered',
    label: 'Exit Intent Modal'
  },
  EXIT_INTENT_CONVERT: {
    event: 'exit_intent_convert',
    category: 'Conversion',
    action: 'Exit Intent Conversion',
    label: 'Last Chance Offer'
  }
};

// Utility functions for common tracking scenarios
export const trackIntegrationClick = (integrationName: string) => {
  trackEvent({
    ...ANALYTICS_EVENTS.INTEGRATION_CLICK,
    label: `Integration: ${integrationName}`
  });
};

export const trackScrollDepth = (percentage: number) => {
  const scrollEvents = {
    25: ANALYTICS_EVENTS.SCROLL_25,
    50: ANALYTICS_EVENTS.SCROLL_50,
    75: ANALYTICS_EVENTS.SCROLL_75,
    100: ANALYTICS_EVENTS.SCROLL_100
  };
  
  const event = scrollEvents[percentage as keyof typeof scrollEvents];
  if (event) {
    trackEvent(event);
  }
};

export const trackTimeOnPage = (seconds: number) => {
  const timeEvents = {
    30: ANALYTICS_EVENTS.TIME_ON_PAGE_30S,
    60: ANALYTICS_EVENTS.TIME_ON_PAGE_60S,
    120: ANALYTICS_EVENTS.TIME_ON_PAGE_120S
  };
  
  const event = timeEvents[seconds as keyof typeof timeEvents];
  if (event) {
    trackEvent(event);
  }
};

// Scroll depth tracking hook
export const useScrollTracking = () => {
  if (typeof window === 'undefined') return;
  
  const scrollThresholds = [25, 50, 75, 100];
  const trackedThresholds = new Set();
  
  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
        trackScrollDepth(threshold);
        trackedThresholds.add(threshold);
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

// Time on page tracking hook
export const useTimeTracking = () => {
  if (typeof window === 'undefined') return;
  
  const startTime = Date.now();
  const trackedTimes = new Set();
  
  const timeThresholds = [30, 60, 120]; // seconds
  
  const checkTimeOnPage = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    timeThresholds.forEach(threshold => {
      if (timeSpent >= threshold && !trackedTimes.has(threshold)) {
        trackTimeOnPage(threshold);
        trackedTimes.add(threshold);
      }
    });
  };
  
  const interval = setInterval(checkTimeOnPage, 1000);
  
  return () => {
    clearInterval(interval);
  };
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}