const seller = require('../seller/Seller'); // Supondo que o arquivo que contém a função 'findSeller' esteja no mesmo diretório
const ClimberSeller = require('../seller/ClimberSeller'); // Importando a classe ClimberSeller
const cerebro = require('../cerebro'); // Supondo que o objeto cerebro está em um arquivo separado

class Tools {
  constructor() {}

  // Processa o texto enviado pelo usuário
  async processarTexto(userId, mensagemUsuario, sessionId) {
    const sellers = {};
    sellers[userId] = [];

    const allSellers = await seller.findSeller(sessionId);
    const userMessage = mensagemUsuario.toString().trim();

    console.log('Mensagem do usuário:', userMessage);

    // Verifica quais vendedores estão na mensagem do usuário
    allSellers.forEach((seller) => {
      if (seller.sellerName) {
        const name = seller.sellerName.toString().trim().toLowerCase();
        console.log('Nome do vendedor:', name);

        if (userMessage.toLowerCase().includes(name)) {
          sellers[userId].push(seller);
        }
      } else {
        console.log('Vendedor sem nome:', seller);
      }
    });

    console.log('Vendedores associados ao usuário:', sellers[userId]);

    // Verifica se sellers[userId] está vazio
    if (sellers[userId].length === 0) {
      console.log('Nenhum vendedor associado encontrado na mensagem. Buscando o vendedor mais recente da sessão...');

      // Busca o vendedor mais recente na sessão
      const mostRecentSeller = allSellers.length > 0 ? allSellers[0] : null;

      if (mostRecentSeller) {
        sellers[userId].push(mostRecentSeller);
        console.log('Vendedor mais recente adicionado:', mostRecentSeller);
      } else {
        console.log('Nenhum vendedor encontrado na sessão.');
      }
    }

    // Verifica o último vendedor e obtém a especialidade
    const lastSeller = sellers[userId].length > 0 ? sellers[userId][sellers[userId].length - 1] : null;

    if (lastSeller) {
      // Certifique-se de que lastSeller possui as propriedades necessárias
      const climberSeller = new ClimberSeller(lastSeller);

      // Obtém a especialidade do vendedor
      const specialty = await climberSeller.invoke();

      // Atualiza o content do system com a especialidade
      cerebro.atualizarHistorico(userId, { role: 'system', content: specialty });
    } else {
      console.log('Nenhum vendedor encontrado para o usuário:', userId);

      // Caso não haja vendedores encontrados, mantém o conteúdo padrão do system
      cerebro.atualizarHistorico(userId, { role: 'system', content: 'Você é um assistente de WhatsApp útil.' });
    }

    // Retorna sem gerar mensagens adicionais
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
      return {
        mimetype: media.mimetype,
        data: `data:${media.mimetype};base64,${media.data}`,
      };
    } catch (error) {
      console.error('Erro ao baixar a mídia:', error);
      return null;
    }
  }
}

module.exports = Tools;
