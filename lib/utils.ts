import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number,
  currency:string = 'USD', locale:string = 'es-US'){
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency:currency,
    }).format(value)
  }

