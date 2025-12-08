'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [router]);

  const removeFromCart = async (itemId: string) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
      window.dispatchEvent(new Event('cart-updated'));
      toast({ title: 'Sucesso', description: 'Item removido do carrinho' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao remover item', variant: 'destructive' });
    }
  };

  const checkout = async () => {
    try {
      await api.post('/orders/checkout');
      window.dispatchEvent(new Event('cart-updated'));
      toast({ title: 'Sucesso', description: 'Pedido realizado com sucesso!' });
      router.push('/orders');
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao finalizar compra', variant: 'destructive' });
    }
  };

  if (!cart) return <div className="p-8 text-center">Carregando carrinho...</div>;

  const total = cart.items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        <Link href="/">
          <Button variant="outline">Continuar Comprando</Button>
        </Link>
      </div>

      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-6">Parece que você ainda não adicionou nenhum produto.</p>
          <Link href="/">
            <Button size="lg">Explorar Produtos</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell>{formatPrice(item.product.price)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatPrice(item.product.price * item.quantity)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>Remover</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-end items-center gap-6 p-6 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold">Total: <span className="text-blue-600">{formatPrice(total)}</span></div>
            <Button size="lg" onClick={checkout} className="w-full md:w-auto">Finalizar Compra</Button>
          </div>
        </>
      )}
    </div>
  );
}
