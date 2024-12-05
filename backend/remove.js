export function removeTags(htmlString) { 
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
}

// Exemplo de uso
const htmlContent = `<div>
    <h2>✅ <strong>Vendedor encontrado!</strong></h2>
    <ul>
        <li><strong>Nome:</strong> João Pereira</li>
        <li><strong>Produto:</strong> Cadeira Gamer</li>
        <li><strong>Descrição:</strong> Uma cadeira ergonômica projetada para máximo conforto em longas horas de jogo.</li>
        <li><strong>Benefícios:</strong> Melhora a postura, previne dores nas costas e oferece suporte ajustável.</li>
    </ul>
    <h3><strong>Personalidade gerada para o WhatsApp:</strong></h3>
    <ul>
        <li><strong>Tom:</strong> Amigável e persuasivo, mas informativo.</li>
        <li><strong>Estilo de vendas:</strong> Focado em destacar os benefícios do produto.</li>
        <li><strong>Mensagem inicial:</strong></li>
    </ul>
    <p>
        "Olá! Eu sou João Pereira, especialista em Cadeira Gamer. Estou aqui para ajudá-lo(a) com qualquer dúvida 
        e garantir que você aproveite ao máximo os benefícios incríveis do nosso produto! Vamos conversar?"
    </p>
</div>`
;
const cleanText = removeTags(htmlContent);

console.log(cleanText); // Saída: "Bem-vindo Este é um texto importante!"
