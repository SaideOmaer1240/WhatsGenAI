import Seller from '../seller/Seller.mjs';
import ClimberSeller from '../seller/ClimberSeller.mjs';  
import Cerebro from '../cerebro.mjs';

const seller = new Seller();
const cerebro = new Cerebro();

class Tools {
  constructor() {}

  // Processa o texto enviado pelo usuário
  async processarTexto(userId, mensagemUsuario, sessionId) {
    const sellers = { [userId]: [] };
    const allSellers = await seller.findSeller(sessionId);
    const userMessage = mensagemUsuario.trim().toLowerCase();

    console.log("Mensagem do usuário:", userMessage);

    // Buscando vendedores que correspondem ao nome na mensagem
    allSellers.forEach(seller => {
        const name = seller.sellerName.toLowerCase();
        if (userMessage.includes(name)) {
            sellers[userId].push(seller);
        }
    });

    // Se não encontrar vendedores na mensagem, pega o mais recente
    if (sellers[userId].length === 0) {
        const mostRecentSeller = allSellers[0] || null;
        if (mostRecentSeller) {
            sellers[userId].push(mostRecentSeller);
            console.log("Vendedor mais recente adicionado:", mostRecentSeller);
        }
    }

    // Continuando com o processamento do vendedor
    const lastSeller = sellers[userId].length ? sellers[userId].slice(-1)[0] : null;
    if (lastSeller) {
        const climberSeller = new ClimberSeller(lastSeller);
        const specialty = await climberSeller.invoke();
        cerebro.atualizarHistorico(userId, { role: "system", content: specialty });
    } else {
        console.log("Nenhum vendedor encontrado para o usuário:", userId);
        cerebro.atualizarHistorico(userId, { role: "system", content: "Você é um assistente de WhatsApp útil." });
    }

    return await cerebro.gerarRespostaIA(userId, mensagemUsuario, sessionId);
  }

  // Processa mídias enviadas pelo usuário
  async processarMedia(userId, mediaData, sessionId) {
    if (mediaData.mimetype.startsWith('image')) {
      return await cerebro.gerarRespostaImagem(userId, mediaData);
    } else if (mediaData.mimetype.startsWith('audio')) {
      return await cerebro.transcreverAudio(userId, mediaData, sessionId);
    }
    return 'Tipo de mídia não suportado.';
  }

  // Baixa a mídia recebida na mensagem
  async baixarMidia(message) {
    try {
      const media = await message.downloadMedia();
      return media ? {
        mimetype: media.mimetype,
        data: `data:${media.mimetype};base64,${media.data}`,
      } : null;
    } catch (error) {
      console.error('Erro ao baixar a mídia:', error);
      return { error: 'Falha ao baixar a mídia.' };
    }
  }
}

export default Tools;

 