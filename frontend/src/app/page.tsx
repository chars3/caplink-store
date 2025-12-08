'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

//dados mock para demonstração quando não há produtos no banco
const MOCK_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Fones de Ouvido Premium',
    description: 'Experimente um som cristalino com nossos fones de ouvido com cancelamento de ruído de última geração.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'mock-2',
    name: 'Cadeira de Escritório Ergonômica',
    description: 'Trabalhe com conforto com esta cadeira ergonômica totalmente ajustável, projetada para produtividade.',
    price: 199.50,
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hhaXJ8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 'mock-3',
    name: 'Smart Watch Série 5',
    description: 'Acompanhe seus exercícios, notificações e muito mais com este relógio inteligente elegante.',
    price: 149.00,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 'mock-4',
    name: 'Teclado Mecânico',
    description: 'Feedback tátil e iluminação RGB personalizável para a melhor experiência de digitação.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D',
  },
];

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';

//página inicial com produtos em destaque
export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  //busca produtos da api com paginação e busca
  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?page=${page}&limit=4&search=${search}`);
      //trata tanto formato antigo (array) quanto novo ({ data, total })
      const productsData = Array.isArray(response.data) ? response.data : response.data.data;

      if (productsData.length === 0 && !search && page === 1) {
        setProducts(MOCK_PRODUCTS);
      } else {
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      setProducts(MOCK_PRODUCTS);
    }
  };

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  //busca favoritos do usuário
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favIds = new Set(response.data.map((fav: any) => fav.product.id));
      setFavorites(favIds as Set<string>);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchProducts();
    fetchFavorites();
  }, [page, search, router]);

  //adiciona produto ao carrinho
  const addToCart = async (productId: string) => {
    if (productId.startsWith('mock-')) {
      toast({ title: 'Apenas Demonstração', description: 'Este é um produto fictício e não pode ser adicionado ao carrinho.', variant: 'default' });
      return;
    }

    try {
      await api.post('/cart', { productId, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      toast({ title: 'Sucesso', description: 'Adicionado ao carrinho' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao adicionar ao carrinho. Por favor, faça login.', variant: 'destructive' });
    }
  };

  //adiciona ou remove produto dos favoritos
  const toggleFavorite = async (productId: string) => {
    if (productId.startsWith('mock-')) {
      toast({ title: 'Apenas Demonstração', description: 'Não é possível favoritar produtos fictícios.', variant: 'default' });
      return;
    }
    try {
      await api.post(`/favorites/${productId}`);

      const isFavorite = favorites.has(productId);
      if (isFavorite) {
        toast({ title: 'Removido', description: 'Item removido dos favoritos' });
      } else {
        toast({ title: 'Adicionado', description: 'Item adicionado aos favoritos' });
      }

      setFavorites(prev => {
        const newFavs = new Set(prev);
        if (isFavorite) {
          newFavs.delete(productId);
        } else {
          newFavs.add(productId);
        }
        return newFavs;
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao atualizar favoritos';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* seção hero com banner principal */}
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4657E1] to-[#1F1F3E] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Bem-vindo à Caplink Store</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">Descubra produtos incríveis com preços imbatíveis.</p>
          <Link href="/products">
            <Button size="lg" className="bg-[#1EC067] hover:bg-[#1EC067]/90 text-white font-bold border-none">
              Ver Todos os Produtos
            </Button>
          </Link>
        </div>
      </section>

      {/* conteúdo principal com grid de produtos */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Produtos em Destaque</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${product.id}`}>
                <div className="h-48 overflow-hidden bg-gray-100 relative group cursor-pointer">
                  <span className="absolute top-2 left-2 z-10 bg-[#1EC067] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    NOVO
                  </span>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sem Imagem</div>
                  )}
                </div>
              </Link>
              <CardHeader className="pb-2">
                <Link href={`/products/${product.id}`}>
                  <CardTitle className="text-lg line-clamp-1 hover:text-[#1EC067] transition-colors cursor-pointer" title={product.name}>{product.name}</CardTitle>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[#1EC067]">{formatPrice(product.price)}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(product.id)} className={`hover:bg-red-50 ${favorites.has(product.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}>
                      <Heart className={`h-5 w-5 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{favorites.has(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" onClick={() => addToCart(product.id)}>
                      Adicionar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar ao carrinho</p>
                  </TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>
          ))}
        </div>


      </div>
    </div>
  );
}
