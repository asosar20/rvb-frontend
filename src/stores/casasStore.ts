import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { parseISO } from 'date-fns'
import {
  guardarCasas,
  obtenerCasas,
  guardarUltimaFechaLocal,
  obtenerUltimaFechaLocal,
  limpiarCasas
} from '@/utils/casaStorage'
import type { CasaRespuesta } from '@/types/CasaRespuesta'

export const useCasasStore = defineStore('casas', () => {
  const casas = ref<CasaRespuesta>({ cantidad: 0, data: [] })
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const modulos = ref([37.5, 50.6, 81.75])
  const moduloSeleccionado = ref(37.5)
  const manzanaSeleccionada = ref('')
  const loteSeleccionado = ref('')

  const casasFiltradas = computed(() => {
    return casas.value.data.filter(c => {
      return (
        (!moduloSeleccionado.value || c.modulo_m2 === moduloSeleccionado.value) &&
        (!manzanaSeleccionada.value || c.manzana === manzanaSeleccionada.value) &&
        (!loteSeleccionado.value || c.lote === loteSeleccionado.value)
      )
    })
  })

  const manzanasDisponibles = computed(() => {
    if (!moduloSeleccionado.value) return []
    const set = new Set(
      casas.value.data
        .filter(c => c.modulo_m2 === moduloSeleccionado.value)
        .map(c => c.manzana)
    )
    return [...set]
  })

  const lotesDisponibles = computed(() => {
    if (!moduloSeleccionado.value || !manzanaSeleccionada.value) return []
    const set = new Set(
      casas.value.data
        .filter(c => c.modulo_m2 === moduloSeleccionado.value && c.manzana === manzanaSeleccionada.value)
        .map(c => c.lote)
    )
    return [...set]
  })

  watch(manzanaSeleccionada, () => {
    loteSeleccionado.value = ''
  })

  async function cargarCasas() {
    try {
      cargando.value = true
      error.value = null

      const ahora = new Date()
      const ultimaFechaLocalStr = await obtenerUltimaFechaLocal()
      const ultimaRevisionLocal = ultimaFechaLocalStr ? parseISO(ultimaFechaLocalStr) : null

      if (!ultimaRevisionLocal) {
        const res = await axios.get('https://rvb-backend.onrender.com/casas')
        if (res.data?.cantidad && res.data?.data?.length) {
          casas.value = res.data
          console.log('casas',casas.value);
          
          await guardarCasas(res.data)
          await guardarUltimaFechaLocal(ahora.toISOString())
          console.log('📡 Datos actualizados desde API')
        } else {
          throw new Error('Respuesta inválida de la API')
        }
      } else {
        const res = await obtenerCasas()
        if (res) {
          casas.value.data = res.data
          console.log('📥 Datos cargados desde almacenamiento local')
        } else {
          throw new Error('No se encontraron datos en almacenamiento local')
        }
      }

    } catch (e: any) {
      error.value = e.message || 'Error inesperado'
      console.error('❌ Error cargando casas:', e)
    } finally {
      cargando.value = false
    }
  }

  async function refrescarDesdeApi() {
    try {
      cargando.value = true
      error.value = null

      await limpiarCasas()

      const res = await axios.get('https://rvb-backend.onrender.com/casas')

      if (res.data?.cantidad && res.data?.data?.length) {
        casas.value = res.data
        await guardarCasas(res.data)
        await guardarUltimaFechaLocal(new Date().toISOString())
        console.log('📢 Datos forzadamente actualizados desde la API')
      } else {
        throw new Error('Respuesta inválida de la API')
      }
    } catch (e: any) {
      error.value = e.message || 'Error inesperado al refrescar'
      console.error('❌ Error refrescando desde API:', e)
    } finally {
      cargando.value = false
    }
  }

  return {
    casas,
    cargando,
    error,
    modulos,
    moduloSeleccionado,
    manzanaSeleccionada,
    loteSeleccionado,
    casasFiltradas,
    manzanasDisponibles,
    lotesDisponibles,
    cargarCasas,
    refrescarDesdeApi,
  }
})
