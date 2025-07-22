<template>
    <div class="p-6 font-sans text-sm text-black bg-white max-w-xl mx-auto space-y-6 border border-gray-300 shadow-md">
        <!-- Encabezado -->
        <div class="flex justify-between items-center border-b pb-4">
            <img src="../assets/img/logo.png" alt="Logo Arena" class="h-12" />
            <h1 class="text-xl font-bold text-center">COTIZACIÓN</h1>
            <img src="../assets/img/logo.png" alt="Logo RVB" class="h-12" />
        </div>

        <!-- Tabla con ajuste automático de la primera columna -->
        <table class="table-auto rounded-md border border-gray-500 w-full text-sm">
            <tbody>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">PROYECTO:</td>
                    <td class="px-1">ARENA BLANCA</td>
                </tr>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">DISTRITO:</td>
                    <td class="px-1">PIMENTEL - CHICLAYO</td>
                </tr>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">EMPRESA PROMOTORA:</td>
                    <td class="px-1">RVB CONSTRUCTORA S.A.C.</td>
                </tr>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">RUC:</td>
                    <td class="px-1">20613566377</td>
                </tr>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">PARTIDA:</td>
                    <td class="px-1">11387476</td>
                </tr>
                <tr class="border-b">
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">DIRECCIÓN FISCAL:</td>
                    <td class="px-1">CALLE 7 DE ENERO #740 - CERCADO CHICLAYO</td>
                </tr>
                <tr>
                    <td class="bg-gray-100 font-semibold px-1 whitespace-nowrap">CLIENTE:</td>
                    <td class="px-1">JOSE PEDRO PEREZ</td>
                </tr>
            </tbody>
        </table>

        <!-- Detalle de casa -->
        <div v-if="modeloSeleccionado" class="bg-blue-100 p-4 rounded">
            <p><strong>{{ modeloSeleccionado.tipo }}</strong></p>
            <p>ÁREA CONSTRUIDA DE {{ modeloSeleccionado.areaConstruida }} ({{ modeloSeleccionado.numeroPisos }} {{
                modeloSeleccionado.numeroPisos === 1 ? 'PISO' : 'PISOS' }}), EN LA CUAL SE CONSIDERA LOS AMBIENTES:</p>

            <ul class="list-disc ml-6">
                <template v-if="modeloSeleccionado.ambientes.general">
                    <li v-for="(ambiente, index) in modeloSeleccionado.ambientes.general" :key="index">
                        {{ ambiente }}
                    </li>
                </template>

                <template v-else>
                    <li><strong>PRIMER PISO:</strong></li>
                    <li v-for="(ambiente, index) in modeloSeleccionado.ambientes.primerPiso" :key="'p1-' + index">
                        {{ ambiente }}
                    </li>
                    <li><strong>SEGUNDO PISO:</strong></li>
                    <li v-for="(ambiente, index) in modeloSeleccionado.ambientes.segundoPiso" :key="'p2-' + index">
                        {{ ambiente }}
                    </li>
                </template>
            </ul>
        </div>



        <!-- Ubicación -->
        <div class="grid grid-cols-4 text-center rounded-md border border-gray-500">
            <div class="font-bold border-r border-gray-400">MZ</div>
            <div class="border-r border-gray-400">A</div>
            <div class="font-bold border-r border-gray-400">LT</div>
            <div>1</div>
        </div>

        <!-- Área y precio -->
        <div class="w-full overflow-hidden rounded-md border border-gray-500 text-center">
            <table class="w-full text-sm border-collapse table-fixed">
                <colgroup>
                    <col class="w-[50%]" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            ÁREA CONSTRUIDA:</td>
                        <td class="border border-gray-300 px-1">{{ areaConstruida }}</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            ÁREA TOTAL:</td>
                        <td class="border border-gray-300 px-1">90.25 m²</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            UBICACIÓN:</td>
                        <td class="border border-gray-300 px-1">CALLE</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            PRECIO:</td>
                        <td class="border border-gray-300 px-1 font-bold text-red-600">S/115,015</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Financiamiento -->

        <div class="w-full overflow-hidden rounded-md border border-gray-500 text-center">
            <div class="bg-blue-100 p-1">
                <h2 class="font-bold">FINANCIAMIENTO</h2>
            </div>
            <table class="w-full text-sm border-collapse table-fixed">
                <colgroup>
                    <col class="w-[50%]" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            INICIAL:</td>
                        <td class="border border-gray-300 px-1">S/5,000.00</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            PRECIO CON INICIAL:</td>
                        <td class="border border-gray-300 px-1">S/110,015.00</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            DESCUENTO PROMOCIONAL:</td>
                        <td class="border border-gray-300 px-1">S/3,000.00</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            DESCUENTO GERENCIAL:</td>
                        <td class="border border-gray-300 px-1">S/1,500.00</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            SALDO A FINANCIAR:</td>
                        <td class="border border-gray-300 px-1 font-bold text-red-600">S/105,515</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            INTERESES:</td>
                        <td class="border border-gray-300 px-1">S/0.00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Cuotas fijas unificadas -->
        <div class="w-full overflow-hidden rounded-md border border-gray-500 text-center">
            <div class="bg-blue-100 p-1">
                <h2 class="font-bold">PAGO CUOTAS FIJAS</h2>
            </div>
            <table class="w-full text-sm border-collapse table-fixed">
                <colgroup>
                    <col class="w-[50%]" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            CUOTA MENSUAL:</td>
                        <td class="border border-gray-300 px-1">S/2,198.23</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            TIEMPO:</td>
                        <td class="border border-gray-300 px-1">48 MESES</td>
                    </tr>
                </tbody>
            </table>
        </div>


        <!-- Cuotas flexibles -->
        <div class="w-full overflow-hidden rounded-md border border-gray-500 text-center">
            <div class="bg-blue-100 p-1">
                <h2 class="font-bold">PAGO CUOTAS FLEXIBLES</h2>
            </div>
            <table class="w-full text-sm border-collapse table-fixed">
                <colgroup>
                    <col class="w-[50%]" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            12 MESES:</td>
                        <td class="border border-gray-300 px-1">S/1,200</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            12 MESES:</td>
                        <td class="border border-gray-300 px-1">S/1,200</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            12 MESES:</td>
                        <td class="border border-gray-300 px-1">S/1,200</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            12 MESES:</td>
                        <td class="border border-gray-300 px-1">S/1,200</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Contado -->
        <div class="w-full overflow-hidden rounded-md border border-gray-500 text-center">
            <div class="bg-blue-100 p-1">
                <h2 class="font-bold">CONTADO</h2>
            </div>
            <table class="w-full text-sm border-collapse table-fixed">
                <colgroup>
                    <col class="w-[50%]" />
                    <col />
                </colgroup>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            PRECIO A PAGAR:</td>
                        <td class="border border-gray-300 px-1">S/109,015</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            DESCUENTO PROMOCIONAL:</td>
                        <td class="border border-gray-300 px-1">S/3,000</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            DESCUENTO GERENCIAL:</td>
                        <td class="border border-gray-300 px-1">S/1,500</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 bg-gray-100 font-semibold px-1 whitespace-nowrap align-top">
                            PRECIO CONTADO:</td>
                        <td class="border border-gray-300 px-1">S/103,515</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Nota -->
        <div class="text-sm mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 space-y-1">
            <p><strong class="text-gray-700">Nota:</strong> Los descuentos promocionales solo tienen vigencia de 3 días
                hábiles contando desde
                la recepción de dicho documento.</p>
            <p><strong class="text-gray-700">N° DE CUENTA:</strong></p>
            <p class="ml-4"> BCP: 3057104402043 | CCI: 00230500710440204317</p>
            <p class="ml-4">BBVA: 0011-0285-0100211212 | CCI: 011-285-000100211212-44</p>
            <p><strong class="text-gray-700">EMPRESA:</strong> RVB CONSTRUCTORA S.A.C.</p>
            <p><strong class="text-gray-700">CORREO:</strong> <a href="mailto:postventa@rvb.com.pe"
                    class="text-blue-600 underline">postventa@rvb.com.pe</a></p>
        </div>


        <!-- Redes -->
        <div class="flex space-x-4 justify-center mt-4 text-gray-600">
            <span>📘</span>
            <span>📸</span>
            <span>💬</span>
            <span>▶️</span>
        </div>

        <!-- Firmas -->
        <div class="flex justify-around mt-20 text-sm">
            <!-- Firma 1 -->
            <div class="text-center space-y-1">
                <div class="border-t-2 border-gray-700 w-48 mx-auto"></div>
                <p class="mt-1 font-bold">GERENTE ADMINISTRATIVA:</p>
                <p>NANCY RIMARACHIN</p>
            </div>

            <!-- Firma 2 -->
            <div class="text-center space-y-1">
                <div class="border-t-2 border-gray-700 w-48 mx-auto"></div>
                <p class="mt-1 font-bold">GERENTE COMERCIAL:</p>
                <p>IVAN RIMARACHIN</p>
            </div>
        </div>

    </div>
</template>
<script lang="ts" setup>
const areaConstruida = '37.50 m²';
const modelosCasas = [
    {
        tipo: 'CASA TIPO 1',
        numeroPisos: 1,
        areaConstruida: '37.50 m²',
        ambientes: {
            general: [
                '01 AMBIENTE PARA SALA, COMEDOR Y ÁREA DE COCINA',
                '02 DORMITORIOS',
                '01 BAÑO COMPLETO (CON LAVATORIO, DUCHA E INODORO)',
                'ZONA DE LAVANDERÍA (ÁREA NO TECHADA CON CERCO PERIMÉTRICO)'
            ]
        }
    },
    {
        tipo: 'CASA TIPO 2',
        numeroPisos: 1,
        areaConstruida: '50.60 m²',
        ambientes: {
            general: [
                '01 AMBIENTE PARA SALA, COMEDOR Y ÁREA DE COCINA',
                '03 DORMITORIOS',
                '02 BAÑOS COMPLETOS (CON LAVATORIO, DUCHA E INODORO)',
                '01 PASADIZO, ZONA DE LAVANDERÍA (ÁREA NO TECHADA CON CERCO PERIMÉTRICO)'
            ]
        }
    },
    {
        tipo: 'CASA TIPO 3',
        numeroPisos: 2,
        areaConstruida: '81.80 m²',
        ambientes: {
            primerPiso: [
                '01 AMBIENTE PARA SALA, COMEDOR Y COCINA',
                '01 ESTUDIO',
                '02 BAÑO DE VISITA (CON LAVATORIO E INODORO)',
                '01 ESCALERA QUE LLEVA AL SEGUNDO PISO, ZONA DE LAVANDERIA (AREA NO TECHADA CON CERCO PERIMETRICO)'
            ],
            segundoPiso: [
                '01 HALL',
                '01 DORMITORIO PRINCIPAL CON BAÑO COMPLETO (CON LAVATORIO, DUCHA E INODORO).',
                '02 DORMITORIOS.',
                '01 BAÑO COMPLETO (CON LAVATORIO, DUCHA E INODORO)'
            ]
        }
    }
];

const modeloSeleccionado = modelosCasas.find(casa => casa.areaConstruida === areaConstruida);

</script>