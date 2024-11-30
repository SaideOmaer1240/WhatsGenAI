import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="font-sans bg-gradient-to-br from-purple-500 via-blue-700 to-green-700">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="./src/assets/logo.png" alt="INORA Logo" className="h-10" />
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#about" className="hover:text-yellow-300">Sobre</a></li>
              <li><a href="#features" className="hover:text-yellow-300">Funcionalidades</a></li>
              <li><a href="#pricing" className="hover:text-yellow-300">Preços</a></li>
              <li><Link to="/login" className="hover:text-yellow-300">Conecte-se</Link></li>
              <li><Link to="/register" className="hover:text-yellow-300">Inscrever-se</Link></li> 
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="heros bg-gradient-to-r from-purple-600 via-pink-600 to-green-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Transforme seu atendimento ao cliente com  WhatsGenAI</h1>
        <p className="text-2xl mb-6 max-w-3xl mx-auto">
          Aumente suas vendas, melhore o marketing e atenda seus clientes de forma automatizada e personalizada no WhatsApp.
        </p>
        <a href="#cta" className="bg-yellow-400 text-purple-800 py-3 px-8 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300">
          Solicitar Demonstração
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-100 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Por que escolher a WhatsGenAI?</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[

            { icon: "/icon3.png", title: "Integração com WhatsApp Business", description: "Seus clientes podem interagir diretamente no WhatsApp." },
            { icon: "/icon2.png", title: "Respostas Inteligentes", description: "Aumente a eficiência de atendimento ao cliente com respostas automáticas e rápidas, alimentadas por Inteligência Artificial." },
            { icon: "/icon2.png", title: "Multiplos Agentes Inteligentes", description: "Crie diversos vendedores para diversos productos na unica conta de WhatsApp  Business, desta forma permintindo atendimento personalizado ao cliente que deseja um produto especifico." },
            { icon: "/icon1.png", title: "Aumento de Vendas", description: "Nunca perca uma oportunidade de atender seus clientes. Use a Inteligência Artificial ao seu favor, melhorando sua taxa de conversão e vendas." }, 
          ].map((feature, index) => (
            <div key={index} className="sfeature-card bg-gradient-to-br from-gray-50 to-gray-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300">
              <img src={feature.icon} alt={feature.title} className="h-16 mb-4 mx-auto" />
              <h3 className="font-semibold text-2xl mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-900">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Escolha o plano ideal para seu negócio</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Plano Básico", price: "49,90 MZN /mês", description: "Para pequenas empresas ou testes iniciais.", btnText: "Assine Agora" },
            { title: "Plano Profissional", price: "149,90 MZN/mês", description: "Para empresas em crescimento.", btnText: "Assine Agora" },
            { title: "Plano Empresarial", price: "Sob consulta", description: "Para grandes empresas com necessidades específicas.", btnText: "Entre em Contato" },
          ].map((plan, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-purple-800">{plan.title}</h3>
              <p className="text-gray-700 mb-4">{plan.description}</p>
              <p className="text-3xl font-bold mb-6 text-gray-900">{plan.price}</p>
              <a href="#cta" className="bg-purple-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-purple-700 transition-all">
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Pronto para transformar seu atendimento?</h2>
        <p className="mb-6">Solicite uma demonstração ou inicie agora e veja como o INORA pode impulsionar seus resultados.</p>
        <a href="mailto:contato@inora.com" className="bg-yellow-400 text-purple-800 py-3 px-8 rounded-full font-semibold hover:scale-105 transform transition-all">
          Solicitar Demonstração
        </a>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-6 bg-gray-900 text-gray-300 text-center">
        <p>&copy; 2024 INORA. Todos os direitos reservados.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="https://facebook.com/inora" className="hover:text-white">Facebook</a>
          <a href="https://twitter.com/inora" className="hover:text-white">Twitter</a>
          <a href="https://linkedin.com/company/inora" className="hover:text-white">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
