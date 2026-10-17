'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/i18n';
import { BusinessListing } from '@/lib/types';
import { getBusinessPermalink } from '@/lib/permalinks';
import {
  X,
  ShieldCheck,
  Globe,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  RefreshCw,
  ExternalLink,
  KeyRound,
  Mail,
  AlertCircle,
  LogOut,
  Lock,
} from 'lucide-react';
import { Mascot } from '@/components/mascot/Mascot';

const emptySubscribe = () => () => {};

interface AdminModerationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onDataChanged?: () => void;
  mode?: 'modal' | 'embedded';
}

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen = true,
  onClose,
  onDataChanged,
  mode = 'modal',
}) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  // Auth & RBAC State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Login Method: 'key' or 'otp'
  const [loginMethod, setLoginMethod] = useState<'key' | 'otp'>('key');
  const [keyInput, setKeyInput] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');

  // Listings state
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [filterTab, setFilterTab] = useState<'pending' | 'verified' | 'published' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const fetchModerationListings = React.useCallback(async (activeKey?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const keyToUse =
        activeKey ??
        adminKey ??
        (typeof window !== 'undefined' ? sessionStorage.getItem('nordible_admin_key') || '' : '');

      if (keyToUse) {
        headers['x-admin-key'] = keyToUse;
      }

      const res = await fetch('/api/businesses/moderate', { headers });

      if (res.status === 401) {
        setIsAdminAuthenticated(false);
        setListings([]);
        return false;
      }

      const data = await res.json();
      if (data.listings && Array.isArray(data.listings)) {
        setListings(data.listings);
        setIsAdminAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [adminKey]);

  // Check auth state on opening modal
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    const checkAuth = async () => {
      setIsCheckingAuth(true);
      setAuthError(null);

      // 1. Check if an admin key is already stored in session
      const storedKey = typeof window !== 'undefined' ? sessionStorage.getItem('nordible_admin_key') : null;
      if (storedKey) {
        setAdminKey(storedKey);
        const ok = await fetchModerationListings(storedKey);
        if (ok && isSubscribed) {
          setIsCheckingAuth(false);
          return;
        }
      }

      // 2. Check if the user is authenticated via cookie session
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (isSubscribed) {
          if (data.authenticated && data.isAdmin) {
            setIsAdminAuthenticated(true);
            setAdminEmail(data.email);
            await fetchModerationListings();
          } else {
            setIsAdminAuthenticated(false);
          }
        }
      } catch {
        if (isSubscribed) {
          setIsAdminAuthenticated(false);
        }
      } finally {
        if (isSubscribed) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, fetchModerationListings]);

  if (!isOpen || !isMounted) return null;

  // Handle Admin Key Authentication
  const handleKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!keyInput.trim()) {
      setAuthError(isDe ? 'Bitte geben Sie den Sicherheitsschlüssel ein.' : 'Please enter the security key.');
      return;
    }

    setAuthLoading(true);
    try {
      const ok = await fetchModerationListings(keyInput.trim());
      if (ok) {
        setAdminKey(keyInput.trim());
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('nordible_admin_key', keyInput.trim());
        }
        setIsAdminAuthenticated(true);
        setKeyInput('');
      } else {
        setAuthError(
          isDe
            ? 'Ungültiger Sicherheitsschlüssel. Zugriff verweigert.'
            : 'Invalid admin security key. Access denied.'
        );
      }
    } catch {
      setAuthError(isDe ? 'Verbindungsfehler' : 'Connection error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Request Admin OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const clean = otpEmail.toLowerCase().trim();
    if (!clean || !clean.includes('@')) {
      setAuthError(isDe ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : 'Please enter a valid email address.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isDe ? 'Fehler beim Senden des Codes.' : 'Error sending passcode.'));
      }
      setOtpToken(data.token);
      setOtpStep('code');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : isDe ? 'Fehler beim Code-Versand' : 'Error sending passcode');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Verify Admin OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!otpCode || otpCode.length < 6) {
      setAuthError(isDe ? 'Bitte 6-stelligen Code eingeben.' : 'Please enter 6-digit code.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail.toLowerCase().trim(),
          code: otpCode.trim(),
          token: otpToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isDe ? 'Code ungültig' : 'Invalid code'));
      }

      // Check if user has admin privileges
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (meData.authenticated && meData.isAdmin) {
        setIsAdminAuthenticated(true);
        setAdminEmail(meData.email);
        await fetchModerationListings();
      } else {
        throw new Error(
          isDe
            ? 'Dieses Konto verfügt nicht über Administrator-Rechte.'
            : 'This account does not have administrator privileges.'
        );
      }
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : isDe ? 'Verifizierungsfehler' : 'Verification error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nordible_admin_key');
    }
    setAdminKey('');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    setListings([]);
  };

  const handleModerate = async (id: string, action: 'verify' | 'publish') => {
    setActingId(id);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const keyToUse =
        adminKey || (typeof window !== 'undefined' ? sessionStorage.getItem('nordible_admin_key') || '' : '');
      if (keyToUse) {
        headers['x-admin-key'] = keyToUse;
      }

      const res = await fetch('/api/businesses/moderate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        setListings((prev) =>
          prev.map((item) => {
            if (item.id !== id) return item;
            if (action === 'verify') {
              return { ...item, isVerified: true, status: 'verified' };
            }
            if (action === 'publish') {
              return { ...item, isPublished: true, status: 'published' };
            }
            return item;
          })
        );
        if (onDataChanged) onDataChanged();
      }
    } catch {
      // Ignore
    } finally {
      setActingId(null);
    }
  };

  const filtered = listings.filter((item) => {
    if (filterTab === 'pending') return !item.isPublished;
    if (filterTab === 'verified') return item.isVerified && !item.isPublished;
    if (filterTab === 'published') return item.isPublished;
    return true;
  });

  const pendingCount = listings.filter((l) => !l.isPublished).length;

  const isEmbedded = mode === 'embedded';

  const modalBody = (
    <div className={`bg-white w-full ${isEmbedded ? 'max-w-4xl rounded-3xl shadow-sm border border-[#E8ECF4]' : 'md:max-w-2xl md:rounded-3xl rounded-t-3xl shadow-2xl max-h-[90vh] border border-[#E8ECF4]'} flex flex-col overflow-hidden`}>
      {/* Mobile drag handle */}
      {!isEmbedded && (
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 md:hidden" />
      )}

      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-[#E8ECF4] flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-[#145BFF] border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tenant Admin Moderation</span>
          </span>
          {isAdminAuthenticated && pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {pendingCount} {isDe ? 'ausstehend' : 'pending'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdminAuthenticated && (
            <>
              <button
                onClick={() => fetchModerationListings()}
                disabled={isLoading}
                title="Refresh"
                className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleAdminLogout}
                title={isDe ? 'Admin-Abmeldung' : 'Admin Logout'}
                className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-rose-600 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-[#FAFBFF] text-gray-500 hover:text-gray-800 border border-[#E8ECF4] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

        {/* ADMIN GATE: If not authenticated, require Admin Auth */}
        {isCheckingAuth ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 text-[#145BFF] animate-spin mb-3" />
            <p className="text-xs text-slate-500 font-medium">
              {isDe ? 'Berechtigungen werden geprüft...' : 'Checking admin authorization...'}
            </p>
          </div>
        ) : !isAdminAuthenticated ? (
          <div className="p-6 sm:p-8 flex flex-col justify-center min-h-[420px] max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-black text-xl text-[#0D2B75]">
                {isDe ? 'Administrator-Bereich' : 'Administrator Area'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-medium">
                {isDe
                  ? 'Dieser Bereich ist nicht öffentlich verfügbar. Der Zugriff auf Moderationsfunktionen ist ausschließlich für autorisierte Administratoren gestattet.'
                  : 'This section is not publicly available. Access to moderation features is restricted exclusively to authorized administrators.'}
              </p>
            </div>

            {/* Login Mode Selector */}
            <div className="flex rounded-xl bg-gray-100 p-1 text-xs font-bold text-gray-600">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('key');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  loginMethod === 'key' ? 'bg-white text-[#0D2B75] shadow-xs' : 'hover:text-gray-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{isDe ? 'Sicherheitsschlüssel' : 'Security Key'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  loginMethod === 'otp' ? 'bg-white text-[#0D2B75] shadow-xs' : 'hover:text-gray-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isDe ? 'Admin E-Mail OTP' : 'Admin Email OTP'}</span>
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {loginMethod === 'key' ? (
              <form onSubmit={handleKeyLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                    {isDe ? 'Administrator-Sicherheitsschlüssel' : 'Administrator Security Key'}
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs font-mono text-gray-900 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>{isDe ? 'Freischalten & Anmelden' : 'Unlock & Log In'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : otpStep === 'email' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                    {isDe ? 'Admin E-Mail-Adresse' : 'Admin Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    placeholder="mail@nordible.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    {isDe
                      ? 'Nur autorisierte Administratoren erhalten einen Verifizierungscode.'
                      : 'Only registered admin addresses receive access codes.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isDe ? 'Einmalcode anfordern' : 'Request OTP Code'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                    {isDe ? '6-stelliger Sicherheitscode' : '6-digit Security Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full py-3 px-4 text-center tracking-[8px] font-mono font-bold text-xl rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-[#145BFF] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isDe ? 'Code bestätigen & Anmelden' : 'Verify & Log In'}</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpStep('email')}
                    className="text-xs text-gray-500 hover:text-[#145BFF] font-medium cursor-pointer"
                  >
                    {isDe ? 'E-Mail-Adresse ändern' : 'Change email address'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* AUTHENTICATED ADMIN VIEW: Moderation Console */
          <>
            {adminEmail && (
              <div className="px-6 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs text-[#0D2B75]">
                <span className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#145BFF]" />
                  <span>{isDe ? 'Eingeloggt als:' : 'Logged in as:'}</span>{' '}
                  <strong className="font-mono text-[#145BFF]">{adminEmail}</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Admin RBAC Aktiv
                </span>
              </div>
            )}

            {/* Filter Navigation Tabs */}
            <div className="px-6 pt-3 pb-2 border-b border-[#E8ECF4] bg-[#FAFBFF] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setFilterTab('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterTab === 'pending'
                    ? 'bg-[#0D2B75] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {isDe ? 'Ausstehend' : 'Pending Review'} ({listings.filter((l) => !l.isPublished).length})
              </button>
              <button
                onClick={() => setFilterTab('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterTab === 'published'
                    ? 'bg-[#0D2B75] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {isDe ? 'Veröffentlicht' : 'Published'} ({listings.filter((l) => l.isPublished).length})
              </button>
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterTab === 'all'
                    ? 'bg-[#0D2B75] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {isDe ? 'Alle Einträge' : 'All Listings'} ({listings.length})
              </button>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {isLoading && listings.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-[#145BFF] animate-spin mb-3" />
                  <p className="text-xs text-slate-500 font-medium">
                    {isDe ? 'Einträge werden geladen...' : 'Loading submissions...'}
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center max-w-sm mx-auto">
                  <div className="w-20 h-20 mx-auto mb-3">
                    <Mascot variant="working-laptop" alt="Empty" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#0D2B75]">
                    {isDe ? 'Keine Einträge in diesem Filter' : 'No listings in this view'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed font-medium">
                    {isDe
                      ? 'Alle Einreichungen wurden moderiert und veröffentlicht.'
                      : 'All business submissions have been verified and published.'}
                  </p>
                </div>
              ) : (
                filtered.map((item) => {
                  const isActing = actingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-[#E8ECF4] bg-[#FAFBFF] hover:border-[#145BFF]/30 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-black text-sm sm:text-base text-[#0D2B75]">
                              {item.name}
                            </h4>
                            {item.isVerified ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✓ {isDe ? 'Verifiziert' : 'Verified'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {isDe ? 'Ungeprüft' : 'Unverified'}
                              </span>
                            )}

                            {item.isPublished ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#145BFF] border border-blue-200">
                                🚀 {isDe ? 'Live' : 'Live'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                {isDe ? 'Entwurf / Warteschlange' : 'Draft / Queue'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                            Slug: {item.slug || item.id}
                          </p>
                        </div>

                        <span className="text-[11px] font-extrabold text-[#145BFF] bg-blue-50 px-2.5 py-1 rounded-lg">
                          {item.categoryName || item.categoryId}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.description[locale] || item.description['de'] || item.description['en']}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium pt-1 border-t border-[#E8ECF4]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                          <span className="truncate">
                            {item.address}, {item.postalCode} {item.city} ({item.country || 'DE'})
                          </span>
                        </div>
                        {item.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                            <span className="truncate font-mono">{item.phone}</span>
                          </div>
                        )}
                        {item.website && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Globe className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                            <a
                              href={item.website}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate text-[#145BFF] hover:underline"
                            >
                              {item.website}
                            </a>
                          </div>
                        )}
                        {item.hours && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock className="w-3.5 h-3.5 text-[#145BFF] shrink-0" />
                            <span className="truncate">{item.hours}</span>
                          </div>
                        )}
                      </div>

                      {/* Moderation Action Buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8ECF4]">
                        {!item.isVerified && (
                          <button
                            type="button"
                            disabled={isActing}
                            onClick={() => handleModerate(item.id, 'verify')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
                          >
                            {isActing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>{isDe ? '1. Verifizieren' : '1. Verify'}</span>
                          </button>
                        )}

                        {!item.isPublished && (
                          <button
                            type="button"
                            disabled={isActing}
                            onClick={() => handleModerate(item.id, 'publish')}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] text-white text-xs font-extrabold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            {isActing ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>{isDe ? '2. Veröffentlichen' : '2. Publish'}</span>
                          </button>
                        )}

                        {item.isPublished && (
                          <a
                            href={getBusinessPermalink(item, locale)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#145BFF] hover:underline"
                          >
                            <span>{isDe ? 'Im Verzeichnis ansehen' : 'View on Directory'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
  );

  if (isEmbedded) {
    return modalBody;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      {modalBody}
    </div>,
    document.body
  );
};
