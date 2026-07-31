import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, CheckCircle2 } from 'lucide-react';

export const OwnerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authenticateOwner
  } = useStudio();

  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!pinInput.trim()) {
      setErrorMsg('Please enter your Owner Security PIN.');
      return;
    }

    const success = authenticateOwner(pinInput.trim());
    if (success) {
      setPinInput('');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect Owner PIN. Access denied.');
    }
  };

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setPinInput('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1A1918] border border-[#B58E5B]/50 p-6 sm:p-8 max-w-md w-full shadow-2xl relative rounded-none space-y-6 text-left text-white">
        
        {/* Header Title */}
        <div className="flex items-start justify-between border-b border-[#B58E5B]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#B58E5B] bg-[#B58E5B]/10 flex items-center justify-center text-[#B58E5B]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#B58E5B] font-bold block">
                SECURITY VERIFICATION
              </span>
              <h3 className="font-serif text-xl font-normal text-white">
                Studio Owner Access
              </h3>
            </div>
          </div>

          <button
            id="owner-auth-close-btn"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Text */}
        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
          The Owner Portal contains live website editing controls, consultation bookings, and founder details. Please enter your Owner Security PIN to proceed.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B58E5B] font-semibold mb-2">
              Owner Security PIN / Password
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter 4-digit PIN (Default: 1234)"
                autoFocus
                className="w-full px-4 py-3 bg-[#121110] border border-gray-700 focus:border-[#B58E5B] text-white text-base tracking-widest placeholder:text-gray-600 placeholder:text-xs placeholder:tracking-normal focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                title={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {errorMsg && (
              <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* PIN Hint Box */}
          <div className="p-3 bg-[#121110] border border-[#B58E5B]/20 text-[11px] text-gray-400 leading-normal flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-[#B58E5B] shrink-0 mt-0.5" />
            <div>
              <p className="text-gray-300 font-medium">Default Owner PIN: <span className="text-[#B58E5B] font-mono font-bold">1234</span></p>
              <p className="text-[10px] text-gray-400">You can customize or change your Owner PIN anytime inside the Owner Portal settings.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 border border-gray-700 text-xs uppercase tracking-wider text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="owner-auth-submit-btn"
              className="px-6 py-2.5 bg-[#B58E5B] hover:bg-white hover:text-[#121212] text-white text-xs uppercase tracking-widest font-bold transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Unlock Owner Portal</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
