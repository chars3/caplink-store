'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Calendar, DollarSign, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomPagination } from '@/components/ui/custom-pagination';

import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/orders?page=${page}&limit=3`);
        // Handle new { data, total } format
        if (response.data.data) {
          setOrders(response.data.data);
          setTotal(response.data.total);
        } else {
          setOrders(response.data);
          setTotal(response.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [router, page]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-blue-600" /> Histórico de Pedidos
        </h1>
        <Link href="/">
          <Button variant="outline">Voltar para Loja</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold">Nenhum pedido encontrado</h2>
          <p className="text-gray-500 mt-2">Você ainda não realizou nenhuma compra.</p>
          <Link href="/" className="mt-6 inline-block">
            <Button>Começar a Comprar</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="bg-gray-50 border-b py-4">
                  <CardTitle className="flex flex-col md:flex-row justify-between md:items-center text-base font-normal gap-2">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Data do Pedido</span>
                          <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="block text-xs text-gray-500 uppercase">Total</span>
                          <span className="font-medium text-green-600">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Pedido #{order.id.slice(0, 8)}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {order.status === 'PENDING' ? 'Processando' : 'Concluído'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Produto</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead className="text-right pr-6">Preço Unitário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="pl-6 font-medium flex items-center gap-3">
                            <div className="h-10 w-10 min-w-[2.5rem] bg-gray-100 rounded overflow-hidden">
                              {item.product.imageUrl && <img src={item.product.imageUrl} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <span className="line-clamp-1 max-w-[200px] md:max-w-md" title={item.product.name}>
                              {item.product.name}
                            </span>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right pr-6">{formatPrice(item.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {total > 3 && (
            <div className="mt-8">
              <CustomPagination
                currentPage={page}
                totalPages={Math.ceil(total / 3)}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
