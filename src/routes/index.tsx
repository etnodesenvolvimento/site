import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import luharaImg from "@/assets/luhara.png";
import faixaImg from "@/assets/faixa.webp";
import luharaVideo from "@/assets/video_luahara_1.mp4";
import { ChatPill } from "@/components/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Etnodesenvolvimento — Luhara" },
      { name: "description", content: "Converse com a Luhara e conheça o Etnodesenvolvimento." },
    ],
  }),
  component: Index,
});

// ======================================================================
// ANALYTICS / LGPD (Google Analytics + Cloudflare Web Analytics)
// ======================================================================

const CONSENT_KEY = "sne_consent_v1";
const POLICY_VERSION = "2026-09-14";

const GA_ID = "G-6FB8RBBRSG";
const CF_TOKEN = "79bb28947dee4b0ca724db534135ebdc";
const CERT_EMAIL = "etnodesenvolvimento1@gmail.com";

type Consent = { necessary: true; analytics: boolean; policyVersion: string; ts: number };

function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.policyVersion !== POLICY_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean) {
  const c: Consent = { necessary: true, analytics, policyVersion: POLICY_VERSION, ts: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent("sne-consent-changed"));
}

function loadAnalyticsIfConsented() {
  if (typeof window === "undefined" || !getConsent()?.analytics) return;

  if (!document.getElementById("ga4-script")) {
    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  if (!document.getElementById("cf-analytics")) {
    const script = document.createElement("script");
    script.defer = true;
    script.id = "cf-analytics";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
    document.body.appendChild(script);
  }
}

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] bg-ink text-cream px-5 py-4 flex flex-col md:flex-row items-center gap-4 shadow-2xl">
      <p className="text-sm leading-relaxed flex-1">
        Usamos cookies para entender como o site é usado. 
        Saiba mais na nossa{" "}
        <a href="/privacidade" className="underline">
          política de privacidade
        </a>
        .
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => { saveConsent(false); setVisible(false); }}
          className="px-4 py-2 text-sm rounded-sm border border-cream/30 hover:bg-cream/10"
        >
          Só o essencial
        </button>
        <button
          onClick={() => { saveConsent(true); setVisible(false); }}
          className="px-4 py-2 text-sm rounded-sm bg-accent font-bold hover:opacity-90"
        >
          Aceitar tudo
        </button>
      </div>
    </div>
  );
}

// ======================================================================
// MODAL DE VÍDEO DE ENTRADA
// ======================================================================

function IntroVideoModal() {
  const [show, setShow] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show || !videoRef.current) return;
    const v = videoRef.current;
    v.muted = false;
    v.play().catch(() => {
      // Navegador bloqueou autoplay com som (comportamento padrão em quem
      // ainda não interagiu com o domínio). Caímos pra mudo pra garantir
      // que o vídeo toque, e mostramos um botão pra ativar o som.
      v.muted = true;
      setNeedsUnmute(true);
      v.play().catch(() => {});
    });
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-ink/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={() => setShow(false)}
          aria-label="Fechar vídeo"
          className="absolute -top-12 right-0 text-cream text-4xl leading-none font-light hover:opacity-70"
        >
          ×
        </button>
        <video
          ref={videoRef}
          src={luharaVideo}
          autoPlay
          controls
          playsInline
          className="w-full rounded-sm shadow-2xl bg-black"
        />
        {needsUnmute && (
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = false;
                setNeedsUnmute(false);
              }
            }}
            className="absolute bottom-4 left-4 bg-ink text-cream px-4 py-2 text-sm font-bold rounded-sm shadow-lg"
          >
            🔊 Ativar som
          </button>
        )}
      </div>
    </div>
  );
}

// ======================================================================
// Conteúdo da home
// ======================================================================

function Index() {
  const [certStatus, setCertStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    loadAnalyticsIfConsented();
    const onConsentChange = () => loadAnalyticsIfConsented();
    window.addEventListener("sne-consent-changed", onConsentChange);
    return () => window.removeEventListener("sne-consent-changed", onConsentChange);
  }, []);

  async function handleCertificado(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCertStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      "Nome (como sairá no certificado)": data.get("nomeCert") || "",
      "E-mail": data.get("emailCert") || "",
      "Telefone": data.get("telCert") || "Não informado",
      _subject: "Nova solicitação de certificado — Etnodesenvolvimento",
      _template: "table",
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CERT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setCertStatus("sent");
        form.reset();
      } else {
        setCertStatus("error");
      }
    } catch {
      setCertStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10">
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
          <a href="/" className="text-xs sm:text-sm font-bold tracking-tight text-ink shrink-0">
            I SNE · <span className="opacity-60">2026</span>
          </a>
          <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto">
            <a href="#sobre" className="hidden sm:inline text-sm font-medium text-ink/70 hover:text-ink whitespace-nowrap px-1">
              Sobre
            </a>
            <a href="/seminario" className="text-[11px] sm:text-sm font-medium text-ink/70 hover:text-ink whitespace-nowrap px-1">
              Seminário
            </a>
            <a
              href="#certificado"
              className="border border-ink text-ink px-2 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-sm font-bold rounded-sm hover:bg-ink hover:text-cream transition whitespace-nowrap"
            >
              CERTIFICADO
            </a>
            <a
              href="/seminario#inscricao"
              className="bg-ink text-cream px-2 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-sm font-bold rounded-sm hover:opacity-90 transition whitespace-nowrap"
            >
              INSCREVA-SE
            </a>
          </div>
        </nav>
      </header>

      {/* LUHARA + CHAT */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-20 md:pt-10 md:pb-32 flex flex-col items-center text-center">
        <div className="text-lg sm:text-xl md:text-2xl font-light text-ink/70 mb-4 break-words max-w-3xl">
          Projeto Territórios Sustentáveis Fase II
        </div>
        <img
          src={luharaImg}
          alt="Luhara"
          className="w-56 h-56 md:w-80 md:h-80 object-contain"
        />
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-ink/50 mt-6 mb-3">Nossa IA</div>
        <div className="text-6xl md:text-8xl font-light text-ink mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>
          Luhara
        </div>
        <ChatPill />
      </section>

      {/* SOBRE */}
      <section id="sobre" className="max-w-7xl mx-auto px-6 py-20 md:py-28 border-t border-ink/10">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Sobre</div>
        <h2 className="mt-3 text-4xl md:text-5xl text-ink leading-[1.15] max-w-2xl">O que é o Etnodesenvolvimento</h2>
        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-ink/80">
          <p>O <strong className="text-ink">Etnodesenvolvimento</strong> reúne pesquisadores, estudantes, gestores públicos, lideranças comunitárias e organizações sociais para refletir sobre experiências, desafios e perspectivas do desenvolvimento territorial no Brasil.</p>
          <p>Voltado aos povos e comunidades tradicionais, população negra, povos indígenas e comunidades quilombolas, o projeto promove o fortalecimento de políticas públicas e a valorização da pluralidade brasileira.</p>
        </div>
      </section>

      {/* CERTIFICADO */}
      <section id="certificado" className="py-20 md:py-28 bg-ink text-cream border-t border-cream/10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Certificado</div>
          <h2 className="mt-3 text-4xl md:text-6xl">Solicitar certificado de participação.</h2>
          <p className="mt-4 text-lg opacity-70">Informe o nome que deve constar no certificado.</p>

          <form onSubmit={handleCertificado} className="mt-10 space-y-5">
            <div>
              <label htmlFor="nomeCert" className="block text-xs uppercase tracking-widest opacity-60 mb-2">
                Nome (como seu nome sairá no certificado) *
              </label>
              <input
                id="nomeCert"
                name="nomeCert"
                type="text"
                required
                className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-base text-cream placeholder:text-cream/30 focus:outline-none focus:border-accent transition"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="emailCert" className="block text-xs uppercase tracking-widest opacity-60 mb-2">
                  E-mail *
                </label>
                <input
                  id="emailCert"
                  name="emailCert"
                  type="email"
                  required
                  className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-base text-cream placeholder:text-cream/30 focus:outline-none focus:border-accent transition"
                />
              </div>
              <div>
                <label htmlFor="telCert" className="block text-xs uppercase tracking-widest opacity-60 mb-2">
                  Telefone
                </label>
                <input
                  id="telCert"
                  name="telCert"
                  type="tel"
                  className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-base text-cream placeholder:text-cream/30 focus:outline-none focus:border-accent transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={certStatus === "sending"}
              className="w-full md:w-auto px-10 py-4 text-base font-bold rounded-sm hover:opacity-90 transition disabled:opacity-50 bg-accent text-ink"
            >
              {certStatus === "sending" ? "ENVIANDO…" : "SOLICITAR CERTIFICADO →"}
            </button>

            {certStatus === "sent" && (
              <p className="text-sm text-emerald-400">Solicitação recebida! Em breve você receberá o certificado por e-mail.</p>
            )}
            {certStatus === "error" && (
              <p className="text-sm text-red-400">Não foi possível enviar agora. Tente novamente ou escreva para {CERT_EMAIL}.</p>
            )}
          </form>
        </div>
      </section>

      {/* FAIXA */}
      <section className="bg-white py-16 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <img
            src={faixaImg}
            alt="Apoio, Realização e Patrocínio"
            className="w-full max-w-6xl h-auto object-contain"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-cream/70 border-t border-cream/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 text-sm">
          <div>
            <div className="font-bold text-cream text-base">I SNE · 2026</div>
            <p className="mt-2">Etnodesenvolvimento — Seminário Nacional de Etnodesenvolvimento </p>
          </div>
          <div>
            <div className="font-bold text-cream uppercase tracking-widest text-xs mb-3">Contato</div>
            <p>etnodesenvolvimento1@gmail.com</p>
            <p className="mt-1"><a href="/privacidade" className="underline hover:text-cream">Política de Privacidade</a></p>
            <p className="mt-1"><a href="/seminario" className="underline hover:text-cream">Ir para o Seminário</a></p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-cream/10 text-xs opacity-50">
          Copyright © 2026 Etnodesenvolvimento • Todos os direitos reservados.
        </div>
      </footer>

      <IntroVideoModal />
      <CookieConsent />
    </main>
  );
}
