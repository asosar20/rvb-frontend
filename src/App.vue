<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  guardarCasas,
  obtenerCasas,
  guardarUltimaFecha,
  obtenerUltimaFecha
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

    const ultimaLocal = await obtenerUltimaFecha()
    const { data: remota } = await axios.get(
      'https://rvb-backend.onrender.com/casas/ultima-actualizacion'
    )
    const ultimaRemota = remota.ultimaActualizacion

    if (ultimaLocal === ultimaRemota) {
      const local = await obtenerCasas()
      if (local?.cantidad && local?.data?.length) {
        casas.value = local
        console.log('✅ Datos cargados desde localForage')
        return
      }
    }

    const res = await axios.get('https://rvb-backend.onrender.com/casas')
    if (res.data?.cantidad && res.data?.data?.length) {
      casas.value = res.data
      await guardarCasas(res.data)
      await guardarUltimaFecha(ultimaRemota)
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

onMounted(() => {
  cargarCasas()
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">
      Lista de casas <span v-if="casas.cantidad">({{ casas.cantidad }})</span>
    </h1>

    <button
      class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      @click="cargarCasas"
    >
      🔄 Refrescar datos
    </button>

    <div v-if="cargando" class="text-gray-600">Cargando datos...</div>
    <div v-else-if="error" class="text-red-600">❌ {{ error }}</div>

    <ul v-else class="space-y-2">
      <li
        v-for="(casa, index) in casas.data"
        :key="index"
        class="p-2 border rounded shadow-sm"
      >
        <strong>Mz:</strong> {{ casa.manzana }},
        <strong>Lote:</strong> {{ casa.lote }},
        <strong>Módulo:</strong> {{ casa.modulo_m2 }} m²
      </li>
    </ul>
  </div>
</template>
