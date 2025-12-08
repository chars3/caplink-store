'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'SELLER') {
        window.location.href = '/seller/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      alert('Falha no cadastro. Tente novamente.');
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative h-full">
        <div className="absolute inset-0 bg-zinc-900/20 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h2 className="text-4xl font-bold mb-2">Junte-se a nós</h2>
          <p className="text-lg opacity-90">Crie sua conta e comece a comprar.</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Criar Conta</h1>
            <p className="text-balance text-muted-foreground">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <form onSubmit={handleRegister} className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Select onValueChange={setRole} defaultValue={role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Tipo de Conta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="SELLER">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Cadastrar
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/auth/login" className="underline">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
