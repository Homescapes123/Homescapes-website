import React from 'react';
import { AlertCircle } from 'lucide-react';

// Shown when a form submission fails, with direct ways to reach the studio instead.
export const EnquiryErrorNotice: React.FC<{ message: string }> = ({ message }) => (
  <div role="alert" className="flex items-start gap-3 p-4 border border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 text-sm">
    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
    <p>
      {message} Please try again, or reach the studio directly on{' '}
      <a href="https://wa.me/917380334333" target="_blank" rel="noopener noreferrer" className="underline font-medium">
        WhatsApp
      </a>
      , by phone at{' '}
      <a href="tel:+917380334333" className="underline font-medium">
        +91 7380334333
      </a>{' '}
      or by email at{' '}
      <a href="mailto:workwithhomescapes@gmail.com" className="underline font-medium">
        workwithhomescapes@gmail.com
      </a>
      .
    </p>
  </div>
);
