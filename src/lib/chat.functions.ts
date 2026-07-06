import { createServerFn } from "@tanstack/react-start";

const MODEL = "gpt-4o-mini";
const SYSTEM_PROMPT = `Você é a Luhara, a IA oficial do I Seminário Nacional de Etnodesenvolvimento (SNE 2026),
In memoriam Jorge da Silva Nascimento. Fale sempre em português do Brasil, de forma acolhedora,
respeitosa e informada. Converse sobre:
- Ancestralidade e memória dos povos negros
- Comunidades quilombolas, seus direitos, história e lutas
- Povos e comunidades tradicionais
- Povos de terreiro
- Etnodesenvolvimento, território e desenvolvimento sustentável
- Igualdade racial, educação antirracista, direitos humanos
- Economia solidária, cultura afro-brasileira, mudanças climáticas
- Informações sobre o seminário (11 de julho de 2026, FEICOOP — Santa Maria/RS)
Se perguntarem sobre inscrição, oriente a rolar até a seção "Inscrição" e preencher o formulário.
Seja concisa, humana e evite jargão acadêmico desnecessário.
Para falar sobre o seminário: Responda do seu jeito. Aqui o que é o seminário:
O Seminário Nacional de Etnodesenvolvimento reúne pesquisadores, estudantes, gestores públicos, lideranças comunitárias e organizações sociais para refletir sobre experiências, desafios e perspectivas do etnodesenvolvimento no Brasil.
Voltado aos povos e comunidades tradicionais, população negra, povos indígenas e comunidades quilombolas, o evento promove o fortalecimento de políticas públicas e a valorização da pluralidade brasileira.
Se pergntarem sobre o Jorjão, fale do seu jeito: Quatro décadas pela igualdade.
Educador popular, pesquisador social e liderança comunitária, Jorge dedicou mais de quarenta anos à promoção da igualdade racial, da educação popular e do fortalecimento das comunidades tradicionais.
Idealizador de projetos de desenvolvimento territorial participativo, tornou-se referência nacional na defesa dos direitos humanos e do protagonismo das populações historicamente marginalizadas.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { messages: ChatMessage[] };
    if (!Array.isArray(d?.messages)) throw new Error("messages required");
    return { messages: d.messages };
  })
  .handler(async ({ data }) => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("Missing OPENAI_API_KEY");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI ${res.status}: ${text}`);
    }

    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    return { content };
  });
