'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function SellerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  const [sales, setSales] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    const fetchSales = async () => {
      try {
        const response = await api.get(`/orders/seller/sales?page=${page}&limit=10&search=${search}`);
        if (response.data.data) {
          setSales(response.data.data);
          setTotal(response.data.total);
        } else {
          setSales(response.data);
          setTotal(response.data.length);
        }
      } catch (error) {
        console.error('Failed to fetch sales', error);
      }
    };

    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchStats();
    fetchSales();
  }, [router, page, search]);

  if (!stats) return <div className="p-8 text-center">Carregando painel...</div>;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel do Vendedor</h1>
        <div className="space-x-4">
          <Link href="/seller/products">
            <Button>Gerenciar Produtos</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pb-8">
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Vendas Totais</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pb-8">
            <div className="text-2xl font-bold">{stats.totalSold}</div>
            <p className="text-xs text-muted-foreground">Itens vendidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Produtos Cadastrados</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pb-8">
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Ativos na loja</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Mais Vendido</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pb-8">
            <div className="text-sm font-bold truncate h-8 flex items-center" title={stats.bestSellingProduct?.name}>
              {stats.bestSellingProduct ? stats.bestSellingProduct.name : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Produto destaque</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Histórico de Vendas</h2>
          <Input
            placeholder="Buscar por produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
        </div>

        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Qtd</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhuma venda encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.order.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{sale.product.name}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>{formatPrice(sale.price)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatPrice(sale.price * sale.quantity)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6">
          <CustomPagination
            currentPage={page}
            totalPages={Math.ceil(total / 10)}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
