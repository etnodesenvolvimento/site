import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import gilcianeImg from "@/assets/gilciane_neves.webp";
import lucasImg from "@/assets/lucas_alberto_santos.webp";
import pauloImg from "@/assets/paulo_azarias.webp";
import jorjaoImg from "@/assets/jorjao.webp";
import luharaImg from "@/assets/luhara.png";
import faixaImg from "@/assets/faixa.webp";

import { ChatPill } from "@/components/ChatWidget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seminário Nacional de Etnodesenvolvimento — Região Metropolitana de Porto Alegre-RS/Brasil 2026" },
      { name: "description", content: "Setembro de 2026 · Região Metropolitana de Porto Alegre/RS — Ancestralidade, Território e Desenvolvimento para um Brasil Plural. In Memoriam Jorge da Silva Nascimento." },
      { property: "og:title", content: "Seminário Nacional de Etnodesenvolvimento" },
      { property: "og:description", content: "Ancestralidade, Território e Desenvolvimento para um Brasil Plural — Região Metropolitana de Porto Alegre-RS/Brasil, Setembro de 2026" },
    ],
  }),
  component: Index,
});

const INSCRICAO_EMAIL = "etnodesenvolvimento1@gmail.com";

type Track = 1 | 2 | 3 | 4 | 5;
type Block = { time?: string; title: string; subtitle?: string; track: Track; rows: number };

const trackBg: Record<Track, string> = {
  1: "bg-track-1",
  2: "bg-track-2",
  3: "bg-track-3",
  4: "bg-track-4",
  5: "bg-track-5",
};

const day1: Block[] = [
  { title: "Em breve", track: 4, rows: 1 },
  { title: "Em breve", track: 5, rows: 1 },
  { title: "Em breve", track: 1, rows: 2 },
  { title: "Em breve", track: 2, rows: 2 },
  { title: "Em breve", track: 2, rows: 1 },
  { title: "Em breve", track: 3, rows: 2 },
  { title: "Em breve", track: 5, rows: 1 },
];

type Speaker = {
  img: string;
};

const speakers: Speaker[] = [
  { img: gilcianeImg },
  { img: lucasImg },
  { img: pauloImg },
];

const eixosTematicos = [
  "Políticas públicas",
  "Justiça racial",
  "Inclusão social",
  "Sustentabilidade",
  "Cooperativismo",
  "Economia solidária",
  "Investimentos",
  "Cultura",
  "Afroempreendedorismo",
];

function AgendaBlock({ b }: { b: Block }) {
  const span = b.rows === 1 ? "row-span-1" : b.rows === 2 ? "row-span-2" : "row-span-3";
  return (
    <div className={`${trackBg[b.track]} ${span} relative p-4 md:p-5 flex flex-col rounded-sm transition-transform hover:scale-[1.02] hover:z-10 hover:shadow-xl cursor-default`}>
      {b.time && <span className="text-xs font-bold uppercase tracking-wider opacity-70 text-ink">{b.time}</span>}
      <div className="mt-3">
        <h4 className="text-base md:text-lg font-bold text-ink leading-tight">{b.title}</h4>
        {b.subtitle && <p className="mt-2 text-xs md:text-sm text-ink/80 leading-snug">{b.subtitle}</p>}
      </div>
    </div>
  );
}

function DayColumn({ date, weekday, blocks }: { date: string; weekday: string; blocks: Block[] }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-3 border-b-2 border-ink/20 pb-2">
        <div className="text-4xl md:text-5xl font-bold text-ink">{date}</div>
        <div className="text-xs uppercase tracking-widest text-ink/60">Setembro · {weekday}</div>
      </div>
      <div className="grid grid-cols-1 gap-2 auto-rows-[minmax(80px,auto)]">
        {blocks.map((b, i) => <AgendaBlock key={i} b={b} />)}
      </div>
    </div>
  );
}

function Index() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleInscricao(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      "Nome completo": data.get("nome") || "",
      "E-mail": data.get("email") || "",
      "Telefone": data.get("tel") || "Não informado",
      "Instituição / Organização": data.get("org") || "Não informado",
      "Categoria": data.get("cat") || "Não informado",
      "Cidade / Estado": data.get("cidade") || "Não informado",
      _subject: "Nova inscrição — Seminário Nacional de Etnodesenvolvimento",
      _template: "table",
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${INSCRICAO_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setFormStatus("sent");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-sm font-bold tracking-tight text-ink">
            I SNE · <span className="opacity-60">2026</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-ink/70">
            <a href="#sobre" className="hover:text-ink">Sobre</a>
            <a href="#homenageado" className="hover:text-ink">Homenageado</a>
            <a href="#programacao" className="hover:text-ink">Programação</a>
            <a href="#palestrantes" className="hover:text-ink">Palestrantes</a>
            <a href="#local" className="hover:text-ink">Local</a>
          </div>
          <a href="#inscricao" className="bg-ink text-cream px-5 py-2.5 text-sm font-bold rounded-sm hover:opacity-90 transition">INSCREVA-SE</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="bg-cream text-ink">
        <div className="text-center pt-6 pb-2 px-4 text-xl sm:text-2xl md:text-3xl font-light text-ink/80 break-words">
          Projeto Territórios Sustentáveis Fase II
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-20 md:pb-32 pt-6 md:pt-10">
          <h1 className="text-[2.1rem] sm:text-[3.2rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[1.1] tracking-tight max-w-6xl font-light break-words">
            <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-ink/50 mb-2">In Memoriam Jorge da Silva Nascimento (Jorjão)</span>
             Seminário Nacional<br />de Etnodesenvolvimento
          </h1>
          <p className="mt-10 text-2xl md:text-3xl font-light max-w-4xl text-ink/80 leading-snug">
            Ancestralidade, território e desenvolvimento para um Brasil plural
          </p>
          <div className="mt-16 flex flex-wrap gap-10 items-end">
            <div>
              <div className="text-xs uppercase tracking-widest text-ink/50">Quando</div>
              <div className="text-xl font-bold mt-1">Em Setembro · 2026</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-ink/50">Onde</div>
              <div className="text-xl font-bold mt-1">Região Metropolitana de Porto Alegre — RS/Brasil</div>
            </div>
            <a href="#inscricao" className="ml-auto bg-ink text-cream px-8 py-4 text-sm font-bold rounded-sm hover:opacity-90 transition">INSCREVA-SE GRATUITAMENTE →</a>
          </div>

          <div className="mt-16 flex justify-center">
            <img
              src={faixaImg}
              alt="Apoio, Realização e Patrocínio"
              className="w-full max-w-6xl h-auto object-contain"
            />
          </div>

          <div className="mt-36 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 text-center md:text-left">
            <img
              src={luharaImg}
              alt="Luhara"
              className="w-40 h-40 md:w-56 md:h-56 object-contain flex-shrink-0"
            />
            <div className="flex flex-col items-center md:items-start">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-ink/50 mb-3">Nossa IA</div>
              <div className="text-6xl md:text-8xl font-light text-ink mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>
                Luhara
              </div>
              <ChatPill className="mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">01 / Sobre</div>
            <h2 className="mt-3 text-4xl md:text-5xl text-ink">Um espaço de diálogo e produção de conhecimento</h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-lg leading-relaxed text-ink/80">
            <p>O <strong className="text-ink">Seminário Nacional de Etnodesenvolvimento</strong> reúne pesquisadores, estudantes, gestores públicos, lideranças comunitárias e organizações sociais para refletir sobre experiências, desafios e perspectivas do etnodesenvolvimento no Brasil.</p>
            <p>Voltado aos povos e comunidades tradicionais, população negra, povos indígenas e comunidades quilombolas, o evento promove o fortalecimento de políticas públicas e a valorização da pluralidade brasileira.</p>
            <p>Uma tarde de palestras, mesas-redondas e relatos de experiências.</p>
          </div>
        </div>
      </section>

      {/* HOMENAGEADO */}
      <section id="homenageado" className="bg-ink text-cream py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 md:gap-16 items-center">
          <div className="md:col-span-2">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">02 / Homenageado</div>
            <div className="mt-4 flex items-baseline gap-4 flex-wrap">
              <h2 className="text-4xl md:text-6xl font-light">Jorge da Silva Nascimento</h2>
            </div>
            <p className="mt-2 text-lg opacity-60 italic">"Jorjão"</p>
            <h3 className="mt-8 text-2xl md:text-3xl font-bold">Quatro décadas pela igualdade.</h3>
            <p className="mt-6 text-lg leading-relaxed opacity-80">
              Educador popular, pesquisador social e liderança comunitária, Jorge dedicou mais de quarenta anos à promoção da igualdade racial, da educação popular e do fortalecimento das comunidades tradicionais.
            </p>
            <p className="mt-4 text-lg leading-relaxed opacity-80">
              Idealizador de projetos de desenvolvimento territorial participativo, tornou-se referência nacional na defesa dos direitos humanos e do protagonismo das populações historicamente marginalizadas.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src={jorjaoImg}
              alt="Jorge da Silva Nascimento (Jorjão)"
              className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover object-top shadow-2xl border-4 border-cream/10"
            />
          </div>
        </div>
      </section>

      {/* TEMA */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">03 / Tema 2026</div>
        <h2 className="mt-3 text-4xl md:text-6xl text-ink max-w-4xl">
          Ancestralidade, Território e Desenvolvimento para um <span className="text-accent">Brasil Plural</span>
        </h2>
        <p className="mt-8 text-lg md:text-xl max-w-3xl text-ink/70 leading-relaxed">
          Como a valorização da identidade dos povos tradicionais contribui para modelos sustentáveis de desenvolvimento, fortalecendo políticas públicas, inclusão social, justiça racial e preservação ambiental.
        </p>
      </section>

      {/* PROGRAMAÇÃO */}
      <section id="programacao" className="py-20 md:py-28 border-y" style={{ backgroundColor: "#f7f3e8", borderColor: "rgba(31,30,58,0.1)", color: "#1f1e3a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#c0392b" }}>04 / Programação</div>
              <h2 className="mt-3 text-5xl md:text-7xl font-extrabold" style={{ color: "#1f1e3a" }}>AGENDA</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "#1f1e3a" }}>
              <LegendItem track={1} label="Palestras" />
              <LegendItem track={2} label="Mesas & Painéis" />
              <LegendItem track={3} label="Oficinas" />
              <LegendItem track={4} label="Cultura" />
              <LegendItem track={5} label="Cerimônias" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <DayColumn date="Em breve" weekday="data a definir" blocks={day1} />
          </div>
        </div>
      </section>

      {/* PALESTRANTES */}
      <section id="palestrantes" className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">05 / Convidados</div>
          <h2 className="mt-3 text-4xl md:text-5xl mb-3">Quem estará com a gente</h2>
          <p className="mb-12 text-sm opacity-60">Em breve divulgaremos nossos palestrantes.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {speakers.map((s, i) => (
              <div
                key={i}
                className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-ink"
              >
                <img
                  src={s.img}
                  alt="Convidado do seminário"
                  className="absolute inset-0 w-full h-full object-cover object-[50%_20%] transition-all duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EIXOS */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">06 / Eixos Temáticos</div>
        <h2 className="mt-3 text-4xl md:text-5xl text-ink mb-10">O que vamos debater</h2>
        <div className="flex flex-wrap gap-2">
          {eixosTematicos.map((t) => (
            <span key={t} className="px-4 py-2 border border-ink/20 text-sm text-ink hover:bg-ink hover:text-cream transition rounded-full cursor-default">{t}</span>
          ))}
        </div>
      </section>

      {/* LOCAL - GOOGLE MAPS */}
      <section id="local" className="bg-cream border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-accent">07 / Local</div>
            <h2 className="mt-3 text-4xl md:text-5xl text-ink">Região Metropolitana de Porto Alegre, RS</h2>
            <p className="mt-6 text-lg text-ink/70 leading-relaxed">
              O seminário acontece na Região Metropolitana de Porto Alegre, em espaços com infraestrutura completa de acessibilidade.
            </p>
            <ul className="mt-6 space-y-3 text-ink/80">
              <li className="flex gap-3"><span className="text-accent font-bold">→</span> Espaços e banheiros acessíveis</li>
              <li className="flex gap-3"><span className="text-accent font-bold">→</span> Certificado de participação do seminário</li>
              <li className="flex gap-3"><span className="text-accent font-bold">→</span> Evento 100% presencial</li>
            </ul>
          </div>
          <div className="aspect-square md:aspect-[4/5] rounded-sm overflow-hidden border-2 border-ink/10 shadow-xl">
            <iframe
              title="Mapa Região Metropolitana de Porto Alegre/RS"
              src="https://www.google.com/maps?q=Porto+Alegre+RS&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* INSCRIÇÃO */}
      <section id="inscricao" className="py-20 md:py-28" style={{ backgroundColor: "#1f1e3a", color: "#f7f3e8" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#e74c3c" }}>08 / Inscrição</div>
          <h2 className="mt-3 text-4xl md:text-6xl" style={{ color: "#f7f3e8" }}>Garanta sua vaga.</h2>
          <p className="mt-4 text-lg opacity-70">Preencha o cadastro abaixo. Vagas limitadas.</p>

          <form onSubmit={handleInscricao} className="mt-10 space-y-5">
            <Field label="Nome completo" name="nome" required />
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="E-mail" name="email" type="email" required />
              <Field label="Telefone" name="tel" type="tel" />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Instituição / Organização (opcional)" name="org" />
              <SelectField label="Categoria" name="cat" options={["Estudante", "Pesquisador(a)", "Gestor(a) Público(a)", "Liderança Comunitária", "Organização Social", "Outro"]} />
            </div>
            <Field label="Cidade / Estado" name="cidade" />
            <div>
              <label className="flex items-start gap-3 text-sm opacity-80 cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span>Aceito receber comunicações sobre o evento e concordo com os termos de uso e política de privacidade.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="w-full md:w-auto px-10 py-4 text-base font-bold rounded-sm hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: "#e74c3c", color: "#f7f3e8" }}
            >
              {formStatus === "sending" ? "ENVIANDO…" : "CONFIRMAR INSCRIÇÃO →"}
            </button>

            {formStatus === "sent" && (
              <p className="text-sm text-emerald-400">Inscrição recebida! Em breve você receberá a confirmação por e-mail.</p>
            )}
            {formStatus === "error" && (
              <p className="text-sm text-red-400">Não foi possível enviar agora. Tente novamente ou escreva para {INSCRICAO_EMAIL}.</p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-cream/70 border-t border-cream/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 text-sm">
          <div>
            <div className="font-bold text-cream text-base">I SNE · 2026</div>
            <p className="mt-2">Seminário Nacional de Etnodesenvolvimento — In Memoriam Jorge da Silva Nascimento</p>
          </div>
          <div>
            <div className="font-bold text-cream uppercase tracking-widest text-xs mb-3">Contato</div>
            <p>{INSCRICAO_EMAIL}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-cream/10 text-xs opacity-50">
          Copyright © 2026 Etnodesenvolvimento • Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}

function LegendItem({ track, label }: { track: Track; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink/70">
      <span className={`${trackBg[track]} w-4 h-4 rounded-sm`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-widest opacity-70 mb-2">{label}{required && " *"}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-base text-cream placeholder:text-cream/30 focus:outline-none focus:border-accent transition"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-widest opacity-70 mb-2">{label}</label>
      <select
        id={name}
        name={name}
        className="w-full bg-transparent border-b-2 border-cream/30 py-2 text-base text-cream focus:outline-none focus:border-accent transition [&>option]:bg-ink"
      >
        <option value="">Selecione…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
