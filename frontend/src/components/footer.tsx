//componente de rodapé com links, newsletter e copyright
export function Footer() {
  return (
    <footer className="bg-[#1F1F3E] text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Caplink Store</h3>
            <p className="text-sm">
              Sua loja favorita para encontrar os melhores produtos com os melhores preços.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">Produtos</a></li>
              <li><a href="/cart" className="hover:text-white transition-colors">Carrinho</a></li>
              <li><a href="/favorites" className="hover:text-white transition-colors">Favoritos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Envios e Entregas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Receba ofertas exclusivas no seu email.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                className="bg-gray-800 border-none text-sm px-3 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Caplink Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
