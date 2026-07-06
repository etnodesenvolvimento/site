import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithAI } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatPill({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group flex items-center gap-3 w-full max-w-xl bg-ink text-cream rounded-full pl-6 pr-2 py-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] ${className}`}
      >
        <span className="flex-1 text-left text-sm md:text-base opacity-90 truncate">
          Inscreva-se e converse com a Luhara sobre ancestralidade…
        </span>

        <span className="bg-cream text-ink rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg group-hover:bg-accent group-hover:text-cream transition">
          →
        </span>
      </button>

      {open && (
        <ChatModal
          onClose={() => setOpen(false)}
          initialDraft={draft}
          onDraftChange={setDraft}
        />
      )}
    </>
  );
}

function ChatModal({
  onClose,
  initialDraft,
  onDraftChange,
}: {
  onClose: () => void;
  initialDraft: string;
  onDraftChange: (v: string) => void;
}) {
  const send = useServerFn(chatWithAI);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou a Luhara, IA do Seminário Nacional de Etnodesenvolvimento. Posso conversar sobre ancestralidade, comunidades quilombolas, povos tradicionais, território e igualdade racial. Como posso te ajudar?",
    },
  ]);

  const [input, setInput] = useState(initialDraft);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    onDraftChange("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Desculpe, tive um problema para responder agora. Tente novamente em instantes.",
        },
      ]);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-ink/60 backdrop-blur-sm p-0 md:p-6" onClick={onClose}>
      <div
        className="bg-cream w-full md:max-w-2xl h-[85vh] md:h-[70vh] md:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-cream">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ink/50 font-bold">Luára · IA do SNE 2026</div>
            <div className="text-lg font-bold text-ink">Converse com a Luára</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-ink/10 text-ink text-xl flex items-center justify-center">×</button>
        </div>


        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-ink text-cream rounded-br-sm"
                    : "bg-ink/5 text-ink rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-ink/5 text-ink/60 px-4 py-3 rounded-2xl text-sm">Pensando…</div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-ink/10 p-3 bg-cream">
          <div className="flex items-end gap-2 bg-ink/5 rounded-3xl p-2 pl-4">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                onDraftChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="Pergunte sobre ancestralidade, quilombolas, território…"
              className="flex-1 bg-transparent resize-none outline-none text-sm text-ink placeholder:text-ink/40 py-2 max-h-40"
            />
            <button
              onClick={submit}
              disabled={loading || !input.trim()}
              className="bg-ink text-cream w-10 h-10 rounded-full flex items-center justify-center font-bold disabled:opacity-30 hover:opacity-90 transition shrink-0"
            >
              →
            </button>
          </div>
          <div className="text-[10px] text-ink/40 mt-2 text-center">Enter para enviar · Shift+Enter para nova linha</div>
        </div>
      </div>
    </div>
  );
}
