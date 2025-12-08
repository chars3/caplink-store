'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Upload, Plus, Pencil, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPrice } from '@/lib/utils';

export default function SellerProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await api.get(`/products?sellerId=${user.id}&limit=100`);
      // Handle new { data, total } format
      if (response.data.data) {
        setProducts(response.data.data);
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: 'Sucesso', description: 'Produtos importados com sucesso' });
      fetchProducts();
      setFile(null);
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao importar produtos', variant: 'destructive' });
    }
  };

  const handleAddProduct = async () => {
    try {
      await api.post('/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
      });
      toast({ title: 'Sucesso', description: 'Produto criado com sucesso' });
      fetchProducts();
      setIsAddOpen(false);
      setNewProduct({ name: '', description: '', price: '', imageUrl: '' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao criar produto', variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast({ title: 'Sucesso', description: 'Produto excluído com sucesso' });
      fetchProducts();
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir produto', variant: 'destructive' });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await api.patch(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: parseFloat(editingProduct.price),
        imageUrl: editingProduct.imageUrl,
      });
      toast({ title: 'Sucesso', description: 'Produto atualizado com sucesso' });
      fetchProducts();
      setIsEditOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar produto', variant: 'destructive' });
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(), // Convert to string for input
    });
    setIsEditOpen(true);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Produtos</h1>
        <div className="space-x-4 flex items-center">
          <Link href="/seller/dashboard">
            <Button variant="outline">Voltar ao Painel</Button>
          </Link>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="secondary">
                <Plus className="h-4 w-4" /> Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Produto</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    placeholder="https://..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddProduct}>Salvar Produto</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Produto</DialogTitle>
              </DialogHeader>
              {editingProduct && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Nome</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Preço</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Descrição</Label>
                    <Input
                      id="edit-description"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-image">URL da Imagem</Label>
                    <Input
                      id="edit-image"
                      placeholder="https://..."
                      value={editingProduct.imageUrl}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleUpdateProduct}>Atualizar Produto</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" /> Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Produtos via CSV</DialogTitle>
              </DialogHeader>
              <div className="grid w-full max-w-sm items-center gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="csv">Arquivo CSV</Label>
                  <Input id="csv" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
                <Button onClick={handleFileUpload} disabled={!file}>Enviar</Button>
                <p className="text-xs text-gray-500">Formato: name, description, price, imageUrl</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell className="max-w-md truncate">{product.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar Produto</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Excluir Produto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
