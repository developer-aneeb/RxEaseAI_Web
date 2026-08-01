import React from 'react';
import MaterialIcon from '../../components/ui/MaterialIcon';
import Button from '../../components/ui/Button';

export default function TwoFactorChallenge({ 
  otpCodeInput, 
  setOtpCodeInput, 
  handleVerify2FALogin, 
  isVerifying2FA, 
  onCancel 
}) {
  return (
    <div className="flex flex-col gap-4 py-4 animate-fade-in text-center relative z-10">
      <div className="w-16 h-16 bg-primary/20 dark:bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <MaterialIcon name="lock" className="text-primary text-3xl" />
      </div>
      <h3 className="text-xl font-bold text-on-surface dark:text-white">Two-Factor Authentication</h3>
      <p className="text-on-surface-variant dark:text-slate-400 text-sm mb-4">
        Please enter the 6-digit code from your authenticator app.
      </p>
      
      <input
        type="text"
        value={otpCodeInput}
        onChange={(e) => setOtpCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        className="w-full text-center tracking-[0.5em] font-mono text-2xl py-4 rounded-xl border border-outline-variant dark:border-slate-800 bg-surface/50 dark:bg-slate-900/50 focus:border-primary outline-none text-on-surface dark:text-white placeholder:tracking-normal placeholder:opacity-50"
      />

      <div className="flex flex-col gap-3 mt-4">
        <Button 
          variant="custom"
          size="none"
          onClick={handleVerify2FALogin}
          disabled={isVerifying2FA || otpCodeInput.length < 6}
          className="w-full py-3.5 rounded-xl bg-gradient-btn text-white font-semibold flex justify-center items-center transition-all duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,85,201,0.4)]"
        >
          {isVerifying2FA ? 'Verifying...' : 'Verify Code'}
        </Button>
        <Button
          variant="outline"
          className="w-full py-3.5"
          onClick={onCancel}
          disabled={isVerifying2FA}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
