'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
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
    fetchFavorites();
  }, [router]);

  const removeFavorite = async (productId: string) => {
    try {
      await api.post(`/favorites/${productId}`); // Toggle removes if exists
      fetchFavorites();
      toast({ title: 'Removido', description: 'Item removido dos favoritos' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar favoritos', variant: 'destructive' });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart', { productId, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated')); // Update header badge
      toast({ title: 'Sucesso', description: 'Adicionado ao carrinho' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao adicionar ao carrinho', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Heart className="text-red-500 fill-current" /> Meus Favoritos
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Você ainda não tem favoritos.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {favorites.map((fav) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden bg-gray-100 relative group">
                  {fav.product.imageUrl ? (
                    <img
                      src={fav.product.imageUrl}
                      alt={fav.product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">Sem Imagem</div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{fav.product.name}</CardTitle>
                  <p className="text-sm text-gray-500 line-clamp-2 h-10">{fav.product.description}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">R$ {fav.product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm" onClick={() => removeFavorite(fav.product.id)} className="text-red-500 hover:text-red-700">
                    Remover
                  </Button>
                  <Button size="sm" onClick={() => addToCart(fav.product.id)}>
                    Adicionar
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
