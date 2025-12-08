'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CustomPagination } from "@/components/ui/custom-pagination";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  // Update search state when URL param changes
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null) {
      setSearch(query);
    }
  }, [searchParams]);

  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?page=${page}&limit=12&search=${search}`);
      // Handle new { data, total } format
      if (response.data.data) {
        setProducts(response.data.data);
        setTotal(response.data.total);
      } else {
        // Fallback for old format
        setProducts(response.data);
        setTotal(response.data.length); // Approximate
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const addToCart = async (productId: string) => {
    try {
      await api.post('/cart', { productId, quantity: 1 });
      window.dispatchEvent(new Event('cart-updated'));
      toast({ title: 'Sucesso', description: 'Adicionado ao carrinho' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao adicionar ao carrinho. Por favor, faça login.', variant: 'destructive' });
    }
  };

  const toggleFavorite = async (productId: string) => {
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Todos os Produtos</h1>
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link href={`/products/${product.id}`}>
                <div className="h-48 overflow-hidden bg-gray-100 relative group cursor-pointer">
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
                <p className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</p>
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
      )}

      <div className="mt-12">
        <CustomPagination
          currentPage={page}
          totalPages={Math.ceil(total / 12)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
