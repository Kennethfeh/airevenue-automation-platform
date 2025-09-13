'use client'

import { useEffect } from 'react'
import { useScrollTracking, useTimeTracking } from '@/lib/analytics-events'
import { useResourcePreloading, useWebVitals } from '@/hooks/use-performance-optimization'

/**
 * Landing Page Analytics Tracker
 * Tracks user engagement and performance metrics for conversion optimization
 */
export const LandingPageTracker: React.FC = () => {
  // Initialize performance optimizations
  useResourcePreloading();
  useWebVitals();

  useEffect(() => {
    // Initialize tracking
    const cleanupScroll = useScrollTracking();
    const cleanupTime = useTimeTracking();

    // Track page load
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'AI Customer Service Automation Landing Page',
        page_location: window.location.href,
        event_category: 'Landing Page'
      });
    }

    // Track exit intent
    let exitIntentShown = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        if (window.gtag) {
          window.gtag('event', 'exit_intent_detected', {
            event_category: 'Lead Generation',
            event_label: 'Exit Intent Trigger'
          });
        }
        // Trigger exit intent modal here
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // Track form interactions
    const trackFormInteractions = () => {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('focus', () => {
          if (window.gtag) {
            window.gtag('event', 'form_start', {
              event_category: 'Lead Generation',
              event_label: 'Form Interaction Started'
            });
          }
        }, { once: true, capture: true });
      });
    };

    // Track button clicks
    const trackCTAClicks = () => {
      const ctaButtons = document.querySelectorAll('[data-cta]');
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          const ctaType = target.getAttribute('data-cta');
          if (window.gtag && ctaType) {
            window.gtag('event', 'cta_click', {
              event_category: 'Conversion',
              event_label: ctaType,
              event_action: 'CTA Click'
            });
          }
        });
      });
    };

    // Initialize after DOM is ready
    setTimeout(() => {
      trackFormInteractions();
      trackCTAClicks();
    }, 1000);

    // Cleanup function
    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupTime) cleanupTime();
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};