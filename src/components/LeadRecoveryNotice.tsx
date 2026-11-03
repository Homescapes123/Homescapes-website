import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  RecoverableEnquiry,
  RECOVERY_FIELD_LABELS,
  deliverRecoverableEnquiry,
  dismissRecoverableEnquiry,
  findRecoverableEnquiries
} from '../lib/leadRecovery';
import { EnquiryError } from '../lib/enquiry';
import { EnquiryErrorNotice } from './EnquiryErrorNotice';

// Shown once to visitors whose request the old website saved only in their browser (see src/lib/leadRecovery.ts).
// It sends nothing unless the visitor clicks "Send it to the studio".
const SHOW_AFTER_MS = 1600; // after the intro loader

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export const LeadRecoveryNotice: React.FC = () => {
  const [queue, setQueue] = useState<RecoverableEnquiry[]>(() => findRecoverableEnquiries());
  const [visible, setVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [current?.id]);

  useEffect(() => {
    if (visible && !sent) sendButtonRef.current?.focus();
  }, [visible, sent, current?.id]);

  if (!current || !visible) return null;

  const next = () => {
    setQueue(prev => prev.slice(1));
    setSent(false);
    setError('');
  };

  // Closing without sending counts as "no thanks": the offer is not repeated, the saved copy stays.
  const dismiss = () => {
    if (isSending) return;
    if (!sent) dismissRecoverableEnquiry(current.id);
    next();
  };

  const send = async () => {
    setIsSending(true);
    setError('');
    try {
      await deliverRecoverableEnquiry(current);
      setSent(true);
    } catch (err) {
      setError(err instanceof EnquiryError ? err.message : "We couldn't send your request right now. Please try again in a moment.");
    } finally {
      setIsSending(false);
    }
  };

  const isBooking = current.form === 'booking';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onKeyDown={e => e.key === 'Escape' && dismiss()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-recovery-title"
        className="bg-[#F8F5F2] dark:bg-[#141312] w-full max-w-xl border border-[#B58E5B]/40 shadow-2xl relative text-[#1F1F1F] dark:text-gray-100 max-h-[92vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-[#D8CBBE]/40 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-[#F8F5F2]/90 dark:bg-[#141312]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#B58E5B] text-[#B58E5B] flex items-center justify-center font-serif text-sm">
              H
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B58E5B] block">A note from the studio</span>
              <h3 id="lead-recovery-title" className="font-serif text-xl font-normal text-[#1F1F1F] dark:text-white">
                {sent ? 'Request Sent' : 'Did we miss your request?'}
              </h3>
            </div>
          </div>
          <button
            id="lead-recovery-close-btn"
            onClick={dismiss}
            disabled={isSending}
            aria-label="Close"
            className="p-2 text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {sent ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 bg-[#B58E5B] text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                Thank you, {current.fields.name}. Your request has reached the studio and we'll reply to {current.fields.email}
                {isBooking ? ' to arrange a new appointment time.' : '.'}
              </p>
              <button
                onClick={next}
                className="px-6 py-3 bg-[#1F1F1F] dark:bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B58E5B] transition-colors"
              >
                {queue.length > 1 ? 'Next saved request' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                On {formatDate(current.submittedAt)} you sent us a {isBooking ? 'consultation request' : 'message'} from
                this browser. Because of a fault in our website at the time, it was saved only on your device and never
                reached the studio. We're sorry. If you'd still like us to have it, you can send it now exactly as shown
                below. Nothing is sent unless you choose to.
              </p>

              <dl className="border border-[#D8CBBE]/60 dark:border-gray-800 divide-y divide-[#D8CBBE]/60 dark:divide-gray-800 text-sm">
                {Object.entries(RECOVERY_FIELD_LABELS)
                  .filter(([key]) => current.fields[key])
                  .map(([key, label]) => (
                    <div key={key} className="grid grid-cols-3 gap-3 px-4 py-2.5">
                      <dt className="text-[11px] uppercase tracking-wider text-[#B58E5B] pt-0.5">{label}</dt>
                      <dd className="col-span-2 break-words whitespace-pre-line">{current.fields[key]}</dd>
                    </div>
                  ))}
              </dl>

              {isBooking && current.fields.preferredDate && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The appointment time you chose may have passed; the studio will reply to arrange a new one.
                </p>
              )}

              {error && <EnquiryErrorNotice message={error} />}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  ref={sendButtonRef}
                  id="lead-recovery-send-btn"
                  onClick={send}
                  disabled={isSending}
                  className="flex-1 px-6 py-3.5 bg-[#B58E5B] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#121212] transition-colors disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSending ? 'Sending…' : 'Send it to the studio'}
                </button>
                <button
                  id="lead-recovery-dismiss-btn"
                  onClick={dismiss}
                  disabled={isSending}
                  className="flex-1 px-6 py-3.5 border border-[#1F1F1F] dark:border-white text-[#1F1F1F] dark:text-white text-xs uppercase tracking-[0.2em] font-medium hover:border-[#B58E5B] hover:text-[#B58E5B] transition-colors disabled:opacity-60"
                >
                  No thanks
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
