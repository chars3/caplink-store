'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast({ title: 'Erro', description: 'Produto não encontrado', variant: 'destructive' });
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      const user = localStorage.getItem('user');
      if (!user) return;
      try {
        const response = await api.get('/favorites');
        const favIds = new Set(response.data.map((fav: any) => fav.product.id));
        setFavorites(favIds as Set<string>);
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      }
    };

    if (id) {
      fetchProduct();
      fetchFavorites();
    }
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      toast({ title: 'Sucesso', description: 'Adicionado ao carrinho' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao adicionar ao carrinho. Por favor, faça login.', variant: 'destructive' });
    }
  };

  const toggleFavorite = async () => {
    try {
      await api.post(`/favorites/${product.id}`);
      const isFavorite = favorites.has(product.id);

      if (isFavorite) {
        toast({ title: 'Removido', description: 'Item removido dos favoritos' });
        setFavorites(prev => {
          const newFavs = new Set(prev);
          newFavs.delete(product.id);
          return newFavs;
        });
      } else {
        toast({ title: 'Adicionado', description: 'Item adicionado aos favoritos' });
        setFavorites(prev => {
          const newFavs = new Set(prev);
          newFavs.add(product.id);
          return newFavs;
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Falha ao atualizar favoritos';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Carregando detalhes do produto...</div>;
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products">
        <Button variant="ghost" className="mb-8 gap-2 pl-0 hover:pl-2 transition-all">
          <ArrowLeft className="h-4 w-4" /> Voltar para Loja
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] md:h-[600px] flex items-center justify-center relative group">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-xl">Sem Imagem</div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#1EC067]/10 text-[#1EC067] px-3 py-1 rounded-full text-sm font-bold">
                Em Estoque
              </span>
              {product.seller && (
                <span className="flex items-center gap-1 text-gray-500 text-sm">
                  <Store className="h-4 w-4" /> Vendido por {product.seller.name}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-b py-8">
            <div className="flex items-end gap-4">
              <span className="text-5xl font-bold text-[#1EC067]">{formatPrice(product.price)}</span>
              <span className="text-gray-400 mb-2">à vista</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1 h-14 text-lg gap-2 bg-[#1EC067] hover:bg-[#1EC067]/90" onClick={addToCart}>
              <ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`h-14 w-14 p-0 border-2 ${favorites.has(product.id) ? 'border-red-200 bg-red-50 text-red-500' : 'hover:bg-gray-50'}`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-6 w-6 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
