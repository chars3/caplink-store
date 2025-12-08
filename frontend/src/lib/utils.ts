import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

//combina classes css do tailwind evitando conflitos
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//formata número como moeda brasileira (R$)
export function formatPrice(price: number | string): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
