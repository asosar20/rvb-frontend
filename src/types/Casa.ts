export interface Casa {
  id: string
  etapa: string
  manzana: string
  lote: number
  ubicacion: string
  aplica_calle: boolean
  aplica_parque: boolean
  area_total: number
  costo_terreno_m2: number
  costo_construccion_m2: number
  modulo_m2: number
  bono: number
  costo_lote: number
  costo_construccion_modulo: number
  costo_parcial: number
  calle: number
  parque: number
  costo_venta: number
  adicional_10: number
  costo_con_bono: number
  bono_contado: number
  inicial_3000: number | null
  inicial_5000: number
  inicial_10000: number
  inicial_15000: number
  utilidad_lote: number
  utilidad_modulo: number
  created_at: string
  updated_at: string
}
