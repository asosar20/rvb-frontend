<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { differenceInHours, parseISO } from 'date-fns'

import {
  guardarCasas,
  obtenerCasas,
  guardarUltimaFecha,
  obtenerUltimaFecha,
  guardarUltimaRevisionLocal,
  obtenerUltimaRevisionLocal
} from '@/utils/casaStorage'
import type { CasaRespuesta } from './types/CasaRespuesta'

const casas = ref<CasaRespuesta>({
  cantidad: 0,
  data: [],
})
const cargando = ref(false)
const error = ref<string | null>(null)

async function cargarCasas() {
  try {
    cargando.value = true
    error.value = null

    const ahora = new Date()
    const ultimaRevisionLocalStr = await obtenerUltimaRevisionLocal()
    const ultimaRevisionLocal = ultimaRevisionLocalStr
      ? parseISO(ultimaRevisionLocalStr)
      : null

    const horasDesdeUltimaRevision =
      ultimaRevisionLocal != null
        ? differenceInHours(ahora, ultimaRevisionLocal)
        : Infinity

    if (horasDesdeUltimaRevision < 24) {
      const local = await obtenerCasas()
      if (local?.cantidad && local?.data?.length) {
        casas.value = local
        console.log('🕒 Datos cargados desde local (menos de 24h)')
        return
      }
    }

    const { data: remota } = await axios.get(
      'https://rvb-backend.onrender.com/casas/ultima-actualizacion'
    )
    const ultimaRemota = remota.ultimaActualizacion
    const ultimaLocal = await obtenerUltimaFecha()

    if (ultimaLocal === ultimaRemota) {
      const local = await obtenerCasas()
      if (local?.cantidad && local?.data?.length) {
        casas.value = local
        console.log('✅ Sin cambios: datos cargados desde localForage')
        await guardarUltimaRevisionLocal(ahora.toISOString())
        return
      }
    }

    const res = await axios.get('https://rvb-backend.onrender.com/casas')
    if (res.data?.cantidad && res.data?.data?.length) {
      casas.value = res.data
      await guardarCasas(res.data)
      await guardarUltimaFecha(ultimaRemota)
      await guardarUltimaRevisionLocal(ahora.toISOString())
      console.log('📡 Datos actualizados desde API')
    } else {
      throw new Error('Respuesta inválida de la API')
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

    const res = await axios.get('https://rvb-backend.onrender.com/casas')
    const meta = await axios.get('https://rvb-backend.onrender.com/casas/ultima-actualizacion')

    if (res.data?.cantidad && res.data?.data?.length) {
      casas.value = res.data
      await guardarCasas(res.data)
      await guardarUltimaFecha(meta.data.ultimaActualizacion)
      await guardarUltimaRevisionLocal(new Date().toISOString())
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

const modulos = [37.5, 50.6, 81.75]
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


function formatoSoles(valor: number | null | undefined): string {
  if (!valor) return '--'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(valor)
}

onMounted(() => {
  cargarCasas()
})

function exportarCSV() {
  const encabezado = Object.keys(casasFiltradas.value[0] || {}).join(',')
  const filas = casasFiltradas.value.map(c =>
    Object.values(c).join(',')
  )
  const csv = [encabezado, ...filas].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'casas.csv')
  link.click()
}

</script>

<template>
  <div class="max-w mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      Lista de casas {{ moduloSeleccionado }} m²
      <span v-if="casasFiltradas.length">({{ casasFiltradas.length }})</span>
    </h1>


    <button class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="refrescarDesdeApi">
      🔄 Refrescar datos
    </button>

    <button class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" @click="exportarCSV">
      📁 Exportar CSV
    </button>


    <div class="flex gap-2 mb-4">
      <button v-for="modulo in modulos" :key="modulo" :class="[
        'px-4 py-2 rounded',
        modulo === moduloSeleccionado ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800',
      ]" @click="moduloSeleccionado = modulo">
        {{ modulo }} m²
      </button>
    </div>

    <div class="flex flex-wrap gap-4 mb-4">
      <!-- Manzana -->
      <select v-model="manzanaSeleccionada" class="border p-2 rounded">
        <option value="">Todas las manzanas</option>
        <option v-for="m in manzanasDisponibles" :key="m" :value="m">{{ m }}</option>
      </select>

      <!-- Lote -->
      <select v-model="loteSeleccionado" class="border p-2 rounded" :disabled="!manzanaSeleccionada">
        <option value="">Todos los lotes</option>
        <option v-for="l in lotesDisponibles" :key="l" :value="l">{{ l }}</option>
      </select>

      <!-- Inicial -->
      <!--<select v-model="inicialSeleccionada" class="border p-2 rounded" :disabled="!loteSeleccionado">
        <option value="">Todas las iniciales</option>
        <option v-for="i in inicialesDisponibles" :key="i.clave" :value="i.clave">
          {{ i.clave }} - {{ formatoSoles(i.valor) }}
        </option>
      </select>-->
    </div>


    <div v-if="cargando" class="text-gray-600">Cargando datos...</div>
    <div v-else-if="error" class="text-red-600">❌ {{ error }}</div>

    <div v-if="casasFiltradas.length">
      <table class="min-w-full text-sm border border-gray-300 bg-white">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-2 py-1 border">Etapa</th>
            <th class="px-2 py-1 border">Manzana</th>
            <th class="px-2 py-1 border">Lote</th>
            <th class="px-2 py-1 border">Ubicación</th>
            <th class="px-2 py-1 border">Área Total</th>
            <th class="px-2 py-1 border">Costo Terreno m²</th>
            <th class="px-2 py-1 border">Costo Construcción m²</th>
            <th class="px-2 py-1 border">Costo Lote</th>
            <th class="px-2 py-1 border">Módulo m²</th>
            <th class="px-2 py-1 border">Costo Construcción Módulo</th>
            <th class="px-2 py-1 border">Costo Parcial</th>
            <th class="px-2 py-1 border">Calle</th>
            <th class="px-2 py-1 border">Parque</th>
            <th class="px-2 py-1 border">Costo Venta</th>
            <th class="px-2 py-1 border">Adicional 10%</th>
            <th class="px-2 py-1 border">Bono</th>
            <th class="px-2 py-1 border">Costo con Bono</th>
            <th class="px-2 py-1 border">Bono Contado</th>
            <th class="px-2 py-1 border">Inicial 3000</th>
            <th class="px-2 py-1 border">Inicial 5000</th>
            <th class="px-2 py-1 border">Inicial 10000</th>
            <th class="px-2 py-1 border">Inicial 15000</th>
            <th class="px-2 py-1 border">Utilidad Lote</th>
            <th class="px-2 py-1 border">Utilidad Módulo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="casa in casasFiltradas" :key="casa.id" class="hover:bg-gray-50">
            <td class="px-2 py-1 border">{{ casa.etapa }}</td>
            <td class="px-2 py-1 border">{{ casa.manzana }}</td>
            <td class="px-2 py-1 border">{{ casa.lote }}</td>
            <td class="px-2 py-1 border">{{ casa.ubicacion }}</td>
            <td class="px-2 py-1 border">{{ casa.area_total }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_terreno_m2) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_construccion_m2) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_lote) }}</td>
            <td class="px-2 py-1 border">{{ casa.modulo_m2 }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_construccion_modulo) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_parcial) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.calle) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.parque) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_venta) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.adicional_10) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.bono) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.costo_con_bono) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.bono_contado) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.inicial_3000) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.inicial_5000) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.inicial_10000) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.inicial_15000) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.utilidad_lote) }}</td>
            <td class="px-2 py-1 border">{{ formatoSoles(casa.utilidad_modulo) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-600 italic">
      No hay casas disponibles para el módulo {{ moduloSeleccionado }} m².
    </div>

  </div>
</template>
