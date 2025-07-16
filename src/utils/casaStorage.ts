import type { CasaRespuesta } from '@/types/CasaRespuesta'
import localforage from 'localforage'

localforage.config({
  name: 'RVBApp',
  storeName: 'casas'
})

export async function guardarCasas(casas: any[]) {
  await localforage.setItem('casas', casas)
}

export async function obtenerCasas(): Promise<CasaRespuesta | null> {
  return await localforage.getItem('casas')
}

export async function limpiarCasas() {
  await localforage.removeItem('casas')
}

export async function guardarUltimaFecha(fecha: string) {
  await localforage.setItem('ultimaActualizacion', fecha)
}

export async function obtenerUltimaFecha(): Promise<string | null> {
  return await localforage.getItem('ultimaActualizacion')
}