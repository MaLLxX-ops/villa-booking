"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Trash2,
  ChevronDown,
  ArrowUpRight,
  MapPin,
  BedDouble,
  Users,
  MessageCircle,
} from "lucide-react";
import { villaDataRaw, getLocalizedVilla, formatHarga, Locale } from "@/lib/data";
import { useCurrency } from "@/context/CurrencyContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedVillaIds?: string[];
  quickReplies?: string[];
  timestamp: number;
}

const STORAGE_KEY = "stayvilla_ai_concierge_chat_v1";

export default function AiConcierge() {
  const t = useTranslations("AiChat");
  const locale = useLocale() as Locale;
  const { formatEstimate } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages from LocalStorage or welcome message
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default initial greeting
    setMessages([
      {
        id: "welcome-1",
        role: "assistant",
        content: t("welcomeMessage"),
        quickReplies: [
          "Villa mewah di Ubud",
          "Villa keluarga di Canggu",
          "Bagaimana cara booking?",
          "Studio romantis di Seminyak",
        ],
        timestamp: Date.now(),
      },
    ]);
  }, [t]);

  // Save to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {}
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          locale,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();

      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        recommendedVillaIds: data.recommendedVillaIds,
        quickReplies: data.quickReplies,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Maaf, terjadi gangguan koneksi. Anda juga dapat langsung bertanya ke WhatsApp Admin StayVilla.",
        quickReplies: ["Bagaimana cara booking?", "Lihat Koleksi Villa"],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: t("welcomeMessage"),
        quickReplies: [
          "Villa mewah di Ubud",
          "Villa keluarga di Canggu",
          "Bagaimana cara booking?",
        ],
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              onClick={() => {
                setIsOpen(true);
                setHasUnread(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group bg-gradient-to-r from-navy via-navy to-terracotta text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-terracotta/30 border border-gold-light/30 flex items-center gap-3 cursor-pointer transition-all"
              aria-label={t("triggerLabel")}
            >
              {/* Pulsing online indicator */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>

              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold-light group-hover:rotate-12 transition-transform" />
              </div>

              <span className="hidden sm:inline text-xs font-black tracking-wide text-white">
                {t("badge")}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[420px] max-h-[85vh] sm:max-h-[620px] bg-white rounded-3xl shadow-2xl border border-sand flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-navy to-navy-dark p-4 sm:p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold-light/40 flex items-center justify-center text-gold-light shadow-inner">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    <span>{t("title")}</span>
                    <span className="px-2 py-0.5 rounded-full bg-terracotta text-[9px] font-black uppercase tracking-wider">
                      AI 24/7
                    </span>
                  </h3>
                  <p className="text-[11px] text-cream/70 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>{t("onlineStatus")}</span>
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-cream/60 hover:text-white hover:bg-white/10 transition-colors"
                  title={t("clearChat")}
                  aria-label={t("clearChat")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-cream/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-cream/30 text-xs sm:text-sm">
              {messages.map((msg) => {
                const isAssistant = msg.role === "assistant";

                // Resolve recommended villas if any
                const recommendedVillas =
                  msg.recommendedVillaIds
                    ?.map((id) => villaDataRaw.find((v) => v.id === id))
                    .filter(Boolean)
                    .map((v) => getLocalizedVilla(v!, locale)) || [];

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isAssistant ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 sm:p-4 leading-relaxed whitespace-pre-wrap ${
                        isAssistant
                          ? "bg-white text-navy border border-sand shadow-xs"
                          : "bg-gradient-to-r from-terracotta to-terracotta-dark text-white font-medium shadow-md shadow-terracotta/20"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Interactive Villa Recommendations inside chat */}
                    {isAssistant && recommendedVillas.length > 0 && (
                      <div className="mt-3 w-full space-y-2 max-w-full">
                        {recommendedVillas.map((v) => {
                          const estimate = formatEstimate(v.harga_per_malam);
                          return (
                            <Link
                              key={v.id}
                              href={`/villa/${v.id}`}
                              onClick={() => setIsOpen(false)}
                              className="group block bg-white hover:bg-cream-dark p-2.5 rounded-xl border border-sand hover:border-terracotta/40 shadow-xs transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-sand">
                                  <Image
                                    src={v.galeri_foto[0]}
                                    alt={v.nama}
                                    fill
                                    sizes="56px"
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-xs sm:text-sm text-navy truncate group-hover:text-terracotta-dark transition-colors">
                                    {v.nama}
                                  </h4>
                                  <div className="flex items-center gap-1 text-[11px] text-stone mt-0.5">
                                    <MapPin className="w-3 h-3 text-terracotta shrink-0" />
                                    <span className="truncate">{v.lokasi}</span>
                                  </div>
                                  <div className="flex items-baseline justify-between mt-1">
                                    <span className="font-black text-xs text-terracotta-dark">
                                      {formatHarga(v.harga_per_malam)}
                                    </span>
                                    <span className="text-[10px] text-terracotta font-bold flex items-center gap-0.5 group-hover:underline">
                                      <span>{t("viewVilla")}</span>
                                      <ArrowUpRight className="w-3 h-3" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Suggestion Chips */}
                    {isAssistant &&
                      msg.quickReplies &&
                      msg.quickReplies.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-full">
                          {msg.quickReplies.map((qr, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(qr)}
                              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white hover:bg-terracotta hover:text-white text-charcoal border border-sand shadow-2xs transition-all cursor-pointer"
                            >
                              {qr}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-center gap-2 text-stone bg-white p-3 rounded-2xl border border-sand w-fit shadow-xs">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-terracotta rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-terracotta rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-terracotta rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-semibold">{t("thinking")}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-sand flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t("inputPlaceholder")}
                disabled={isLoading}
                className="flex-1 bg-cream px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-charcoal placeholder:text-stone-light focus:bg-white focus:ring-2 focus:ring-terracotta/20 border border-sand outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-11 h-11 rounded-2xl bg-gradient-to-r from-terracotta to-terracotta-dark disabled:opacity-40 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
                aria-label={t("send")}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
