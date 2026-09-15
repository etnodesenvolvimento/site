import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [{ title: "Política de Privacidade — Seminário Nacional de Etnodesenvolvimento" }],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="max-w-3xl mx-auto px-6 py-20 prose prose-neutral">
        <h1 className="text-4xl font-light mb-2">Política de Privacidade</h1>
        <p className="text-sm text-ink/50 mb-10">Última atualização: 14 de setembro de 2026</p>

        <h2>1. Quem somos</h2>
        <p>
          Este site é mantido pela organização do Seminário Nacional de
          Etnodesenvolvimento (SNE). Dúvidas sobre esta política ou sobre seus
          dados podem ser enviadas para{" "}
          <a href="mailto:etnodesenvolvimento1@gmail.com">
            etnodesenvolvimento1@gmail.com
          </a>
          .
        </p>

        <h2>2. Quais dados coletamos</h2>
        <ul>
          <li>
            <strong>Formulário de inscrição:</strong> nome, e-mail, telefone,
            instituição, categoria e cidade/estado, fornecidos voluntariamente
            por quem se inscreve no evento.
          </li>
          <li>
            <strong>Navegação no site:</strong> páginas visitadas, data e
            hora.
          </li>
          <li>
            <strong>Conversas com a Luhara:</strong> nós <em>não</em>{" "}
            armazenamos o conteúdo das mensagens trocadas com a Luhara, nem
            quem conversou. Apenas contamos, de forma agregada, quantas
            conversas aconteceram e em que data/hora, sem nenhum identificador
            de pessoa.
          </li>
          <li>
            <strong>Cookies de analytics:</strong> usados apenas se você
            aceitar no banner de cookies.
          </li>
        </ul>

        <h2>3. Para que usamos esses dados</h2>
        <ul>
          <li>Organizar sua inscrição e comunicação sobre o evento;</li>
          <li>Entender como o site é usado, para melhorá-lo;</li>
          <li>
            Acompanhar o volume de uso da Luhara, sem acesso ao conteúdo das
            conversas;
          </li>
          <li>Segurança e prevenção de abuso (registro de acesso).</li>
        </ul>

        <h2>4. Compartilhamento</h2>
        <p>
          Não vendemos nem compartilhamos seus dados pessoais com terceiros
          para fins de marketing.
        </p>

        <h2>5. Seus direitos (LGPD)</h2>
        <p>
          Você pode, a qualquer momento, solicitar acesso, correção ou
          exclusão dos seus dados, ou revogar o consentimento de cookies de
          analytics, escrevendo para{" "}
          <a href="mailto:etnodesenvolvimento1@gmail.com">
            etnodesenvolvimento1@gmail.com
          </a>
          . Você também pode limpar o identificador anônimo do seu navegador
          apagando os dados de site/cookies nas configurações do seu
          navegador.
        </p>

      </div>
    </main>
  );
}
