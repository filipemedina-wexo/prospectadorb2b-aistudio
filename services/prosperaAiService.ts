const API_URL = "https://ai.useprospera.com.br/gemini";

export interface Message {
    role: 'user' | 'model';
    text: string;
}

/**
 * Envia mensagem para a IA da Prospera.
 * @param currentMessage A mensagem atual do usuário.
 * @param history O array de mensagens anteriores (chat).
 * @param systemInstruction O "cérebro" da IA (quem ela é, preços, regras).
 */
export const sendMessageToProsperaAI = async (
    currentMessage: string,
    history: Message[],
    systemInstruction: string
): Promise<string> => {

    // 1. Formata histórico (Chat → Texto)
    const historyStr = history.map(msg =>
        `${msg.role === 'user' ? 'CLIENTE' : 'ASSISTENTE'}: ${msg.text}`
    ).join('\n');

    // 2. Monta o Prompt com Contexto + Histórico + Pergunta
    const fullPrompt = `
  CONTEXTO DO NEGÓCIO:
  ${systemInstruction}
  
  HISTÓRICO DA CONVERSA:
  ${historyStr}
  
  MENSAGEM ATUAL DO CLIENTE:
  ${currentMessage}
  `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: fullPrompt, // O SEGREDO ESTÁ AQUI: Tudo vira um prompt único
                context: "Assistente Virtual" // Pode manter fixo ou variar se quiser dar um "tom" extra
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Erro API Prospera:", errorBody);
            throw new Error(`Erro API: ${errorBody}`);
        }

        const data = await response.json();
        return data.output || data.text || "Desculpe, não entendi.";

    } catch (error) {
        console.error("Erro de conexão:", error);
        return "Estou com instabilidade no momento. Pode tentar de novo?";
    }
};
