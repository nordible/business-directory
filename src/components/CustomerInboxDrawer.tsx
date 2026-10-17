'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};
import {
  X,
  Mail,
  Send,
  Sparkles,
  ArrowLeft,
  LogOut,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { Conversation, Message } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface CustomerInboxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerInboxDrawer: React.FC<CustomerInboxDrawerProps> = ({ isOpen, onClose }) => {
  const { locale } = useTranslation();
  const isDe = locale === 'de';

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [authStep, setAuthStep] = useState<'email' | 'otp'>('email');
  const [inputEmail, setInputEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Load conversations
  const loadConversations = React.useCallback(async (email?: string) => {
    setIsLoadingConversations(true);
    try {
      const url = email ? `/api/inquiries/list?email=${encodeURIComponent(email)}` : '/api/inquiries/list';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Load messages for a conversation
  const loadMessages = React.useCallback(async (convId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/inquiries/${convId}/messages`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Check auth on open
  useEffect(() => {
    if (!isOpen) return;

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.email) {
          setIsAuthenticated(true);
          setCustomerEmail(data.email);
          loadConversations(data.email);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [isOpen, loadConversations]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    loadMessages(conv.id);
  };

  // Send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!inputEmail || !inputEmail.includes('@')) {
      setAuthError(
        isDe
          ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (isDe ? 'Fehler beim Senden des Codes.' : 'Error sending code.')
        );
      }
      setOtpToken(data.token);
      setAuthStep('otp');
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error
          ? err.message
          : isDe
          ? 'Fehler beim Code-Versand'
          : 'Error sending passcode'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!otpCode || otpCode.length < 6) {
      setAuthError(
        isDe
          ? 'Bitte geben Sie den vollständigen 6-stelligen Code ein.'
          : 'Please enter the complete 6-digit code.'
      );
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, code: otpCode, token: otpToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error || (isDe ? 'Ungültiger Code.' : 'Invalid code.')
        );
      }

      setIsAuthenticated(true);
      setCustomerEmail(data.email);
      setAuthStep('email');
      loadConversations(data.email);
    } catch (err: unknown) {
      setAuthError(
        err instanceof Error
          ? err.message
          : isDe
          ? 'Ungültiger Code'
          : 'Invalid code'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setCustomerEmail('');
    setConversations([]);
    setSelectedConversation(null);
  };

  // Send message reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/inquiries/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText.trim(),
          senderType: 'customer',
          senderName: customerEmail.split('@')[0],
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setReplyText('');
      }
    } catch {
      // ignore
    } finally {
      setIsSendingReply(false);
    }
  };

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      <div
        className="w-full sm:max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-[#E8ECF4]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF4] bg-gradient-to-r from-[#F3F7FF] to-white">
          <div className="flex items-center gap-3">
            {selectedConversation ? (
              <button
                type="button"
                onClick={() => setSelectedConversation(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#145BFF] flex items-center justify-center">
                <Inbox className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="font-heading font-black text-base text-[#0D2B75] leading-tight">
                {selectedConversation ? selectedConversation.subject : (isDe ? 'Kunden-Postfach' : 'Customer Inbox')}
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {selectedConversation
                  ? selectedConversation.businessName || (isDe ? 'Konversation' : 'Conversation')
                  : isAuthenticated
                  ? customerEmail
                  : (isDe ? 'Sichere Einmalanmeldung (Passwortlos)' : 'Secure Passwordless Login')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && !selectedConversation && (
              <button
                type="button"
                onClick={handleLogout}
                title={isDe ? 'Abmelden' : 'Log out'}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* Unauthenticated View: Passwordless OTP Flow */
            <div className="p-6 sm:p-8 flex flex-col justify-center min-h-[420px] max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#145BFF] flex items-center justify-center mx-auto shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-black text-xl text-[#0D2B75]">
                  {authStep === 'email'
                    ? (isDe ? 'Anmelden ohne Passwort' : 'Passwordless Login')
                    : (isDe ? 'Bestätigungscode eingeben' : 'Enter Verification Code')}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {authStep === 'email'
                    ? (isDe
                        ? 'Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen ein Einmalkennwort (OTP) zur sicheren Anmeldung.'
                        : 'Enter your email address. We will send you a one-time passcode (OTP) for secure sign-in.')
                    : (isDe
                        ? `Wir haben einen 6-stelligen Sicherheitscode an ${inputEmail} gesendet.`
                        : `We have sent a 6-digit security code to ${inputEmail}.`)}
                </p>
              </div>

              {/* Feature Preview Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="font-bold text-amber-900">
                    {isDe ? 'In Vorbereitung (Demnächst)' : 'Under Development (Coming Soon)'}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {isDe
                      ? 'Das Kunden-Postfach wird zu einem späteren Zeitpunkt offiziell freigeschaltet. Der Zugriff ist derzeit noch nicht für die Öffentlichkeit aktiv.'
                      : 'The customer inbox will be officially introduced in an upcoming release. Access is not yet open to the public.'}
                  </p>
                </div>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}


              {authStep === 'email' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                      {isDe ? 'E-Mail-Adresse' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        placeholder="ihre-email@example.de"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8ECF4] bg-[#FAFBFF] focus:bg-white focus:border-[#145BFF] text-xs text-gray-900 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {authLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isDe ? 'Code anfordern' : 'Request Code'}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D2B75] mb-1">
                      {isDe ? '6-stelliger Code' : '6-digit Code'}
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
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDe ? 'Bestätigen & Einloggen' : 'Verify & Log In'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setAuthStep('email')}
                      className="text-xs text-gray-500 hover:text-[#145BFF] font-medium cursor-pointer"
                    >
                      {isDe ? 'E-Mail-Adresse ändern' : 'Change email address'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : selectedConversation ? (
            /* Selected Conversation Thread */
            <div className="flex flex-col h-full">
              {/* AI Triage Banner */}
              {selectedConversation.aiSummary && (
                <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#145BFF] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#0D2B75] space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#145BFF] block">
                      {isDe ? '⚡ KI-Triage & Zusammenfassung' : '⚡ AI Triage & Summary'}
                    </span>
                    <p className="leading-relaxed text-gray-700">{selectedConversation.aiSummary}</p>
                  </div>
                </div>
              )}

              {/* Message List */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-[#145BFF] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    {isDe ? 'Keine Nachrichten vorhanden.' : 'No messages yet.'}
                  </p>
                ) : (
                  messages.map((m) => {
                    const isCustomer = m.senderType === 'customer';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-gray-400">
                          <span className="font-semibold text-gray-600">
                            {isCustomer ? (isDe ? 'Sie' : 'You') : m.senderName || (isDe ? 'Unternehmen' : 'Business')}
                          </span>
                          <span>&bull;</span>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            isCustomer
                              ? 'bg-[#145BFF] text-white rounded-br-xs'
                              : 'bg-[#F3F7FF] text-gray-800 border border-[#E8ECF4] rounded-bl-xs'
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply Input (Bottom Anchored / Thumb Accessible) */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-[#E8ECF4] bg-[#FAFBFF] flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isDe ? 'Antwort verfassen...' : 'Write a reply...'}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8ECF4] bg-white text-xs text-gray-900 focus:border-[#145BFF] outline-none"
                />
                <button
                  type="submit"
                  disabled={isSendingReply || !replyText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#145BFF] hover:bg-[#0D2B75] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isDe ? 'Senden' : 'Send'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Conversation List Across Multiple Businesses */
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8ECF4]">
                <h3 className="font-heading font-black text-sm text-[#0D2B75]">
                  {isDe ? `Ihre Anfragen (${conversations.length})` : `Your Inquiries (${conversations.length})`}
                </h3>
                <button
                  type="button"
                  onClick={() => loadConversations()}
                  className="text-xs text-[#145BFF] hover:underline font-bold cursor-pointer"
                >
                  {isDe ? 'Aktualisieren' : 'Refresh'}
                </button>
              </div>

              {isLoadingConversations ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 border-[#145BFF] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#0D2B75]">
                    {isDe ? 'Noch keine Anfragen vorhanden' : 'No inquiries yet'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    {isDe
                      ? 'Wenn Sie einem Unternehmen auf der Plattform eine Nachricht senden, wird die Unterhaltung hier angezeigt.'
                      : 'When you message a business on the platform, your conversation will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv)}
                      className="p-4 rounded-2xl border border-[#E8ECF4] bg-[#FAFBFF] hover:bg-white hover:border-[#145BFF] hover:shadow-md transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Building2 className="w-4 h-4 text-[#145BFF] shrink-0" />
                          <span className="font-heading font-bold text-xs text-[#0D2B75] truncate">
                            {conv.businessName || (isDe ? 'Unternehmen' : 'Business')}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            conv.status === 'open'
                              ? 'bg-amber-50 text-amber-700'
                              : conv.status === 'in_progress'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {conv.status === 'open'
                            ? (isDe ? 'Offen' : 'Open')
                            : conv.status === 'in_progress'
                            ? (isDe ? 'In Bearbeitung' : 'In Progress')
                            : (isDe ? 'Erledigt' : 'Resolved')}
                        </span>
                      </div>

                      <div className="font-medium text-xs text-gray-900 line-clamp-1 group-hover:text-[#145BFF] transition-colors">
                        {conv.subject}
                      </div>

                      {conv.aiSummary && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-gray-100">
                          <span className="text-[#145BFF] font-semibold">
                            {isDe ? '⚡ Zusammenfassung: ' : '⚡ Summary: '}
                          </span>
                          {conv.aiSummary}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(isDe ? 'de-DE' : 'en-US')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
