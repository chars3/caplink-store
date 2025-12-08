'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleDeleteAccount = async () => {
    try {
      if (!user) return;
      await api.delete(`/users/${user.id}`);

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      toast({ title: 'Conta Excluída', description: 'Sua conta foi desativada com sucesso.' });
      router.push('/');

      // Force reload to update header
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao excluir conta.', variant: 'destructive' });
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Gerencie suas informações de conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatars/01.png" alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.role === 'SELLER' ? 'Vendedor' : 'Cliente'}</p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={user.name} readOnly className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={user.email} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis para sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ao excluir sua conta, você perderá acesso ao histórico de pedidos e não poderá mais fazer login.
              Esta ação não pode ser desfeita.
            </p>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Excluir Minha Conta</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tem certeza absoluta?</DialogTitle>
                  <DialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancelar</Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>Sim, excluir minha conta</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
