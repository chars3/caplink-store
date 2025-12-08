'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sobre a Caplink Store</h1>
        <p className="text-xl text-gray-600">Sua loja de confiança para produtos de tecnologia e escritório.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Nossa Missão</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-gray-600">
              Nossa missão é fornecer produtos de alta qualidade que melhorem a produtividade e o estilo de vida de nossos clientes.
              Acreditamos que a tecnologia deve ser acessível e funcional.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nossa História</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <p className="text-gray-600">
              Fundada em 2024, a Caplink Store começou como um pequeno projeto e cresceu para se tornar uma referência em e-commerce.
              Trabalhamos incansavelmente para curar uma seleção dos melhores produtos do mercado.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Por que escolher a Caplink?</h2>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <div>
            <div className="text-4xl mb-2">🚀</div>
            <h3 className="font-semibold mb-2">Entrega Rápida</h3>
            <p className="text-sm text-gray-500">Enviamos para todo o Brasil com agilidade.</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🛡️</div>
            <h3 className="font-semibold mb-2">Compra Segura</h3>
            <p className="text-sm text-gray-500">Seus dados estão protegidos com a mais alta segurança.</p>
          </div>
          <div>
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold mb-2">Suporte 24/7</h3>
            <p className="text-sm text-gray-500">Estamos sempre prontos para ajudar você.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
