# Plan de Refactorización: Simulador de Fortaleza Financiera

## Estado Actual

El proyecto es una aplicación monolítica de **2,022 líneas** en un solo archivo `index.html` que contiene HTML, CSS y JavaScript mezclados. Funciona bien, pero es difícil de mantener y extender.

### Distribución actual del código

| Sección | Líneas | % del total |
|---------|--------|-------------|
| HTML (estructura) | ~394 | 20% |
| CSS (estilos embebidos) | ~194 | 10% |
| JavaScript (lógica) | ~1,434 | 70% |

### Módulos lógicos identificados

El JavaScript ya tiene estructura lógica clara — el problema es que todo convive en el mismo archivo y en scope global:

| Módulo | Líneas aprox. | Responsabilidad |
|--------|--------------|-----------------|
| Storage & Settings | 591–656 | localStorage, URL params |
| Utilities | 658–717 | formatCurrency, formatShortThreshold |
| Chart Config | 716–912 | Chart.js plugins y configuración |
| Simulation Engine | 936–1,055 | Cálculo de interés compuesto |
| View Updates | 1,057–1,303 | Render de stats, labels, chart data |
| State Persistence | 1,313–1,343 | persistSettings, handleInput |
| Input Sync | 1,305–1,380 | Sincronización range ↔ number inputs |
| Data Managers (×5) | 1,382–1,789 | CRUD: periodos, metas, pausas, eventos, aportes |
| Initialization | 1,791–2,020 | Init, share button, collapsibles |

---

## Problemas a resolver

1. **Dificultad de navegación**: Para encontrar `simulate()` hay que buscar en 2,000 líneas.
2. **Código repetitivo**: Los 5 "data managers" (periodos, metas, pausas, eventos, aportes) son casi idénticos — cada uno tiene `render`, `edit`, `remove`, `add` con la misma estructura.
3. **CSS global sin scope**: Los estilos están mezclados sin separación por componente.
4. **Sin tests posibles**: La lógica de simulación está acoplada al DOM, imposible de testear de forma unitaria.
5. **Scope global**: Todas las funciones están en el scope global del browser — riesgo de colisiones y dificulta razonar sobre el estado.

---

## Estrategia de refactorización

Se proponen **dos caminos** según el nivel de complejidad que el equipo quiera asumir:

### Camino A — Separación simple (sin build tool)
> Recomendado si se quiere cambio mínimo y cero fricción de deploy.

Separar en archivos estáticos, cargar con `<script src>` y `<link rel="stylesheet">`. No requiere Node.js ni bundler. Funciona directo en el browser.

### Camino B — ES6 Modules con Vite (recomendado a largo plazo)
> Recomendado si se quiere arquitectura limpia, tree-shaking, y posibilidad de tests unitarios.

Usar ES6 `import`/`export` con Vite como dev server y bundler. Genera un `dist/` optimizado para producción. Permite escribir tests con Vitest.

---

## Estructura de archivos propuesta (Camino B — recomendado)

```
inversioninterescompuesto/
│
├── index.html                    ← Solo estructura HTML, sin CSS ni JS inline
│
├── src/
│   ├── main.js                   ← Entry point: inicializa todo y conecta módulos
│   │
│   ├── config.js                 ← Constantes: STORAGE_KEY, DEFAULT_SETTINGS
│   │
│   ├── styles/
│   │   ├── base.css              ← CSS variables, reset, tema oscuro
│   │   ├── layout.css            ← Grid, hero, panels, responsive
│   │   ├── controls.css          ← Inputs, sliders, botones
│   │   ├── chart.css             ← Área del chart, tooltips, milestones
│   │   └── collapsible.css       ← Secciones colapsables
│   │
│   ├── core/
│   │   ├── simulation.js         ← simulate(): motor de cálculo puro (sin DOM)
│   │   ├── storage.js            ← loadSettings, saveSettings, URL share
│   │   └── utils.js              ← formatCurrency, formatShortThreshold
│   │
│   ├── chart/
│   │   ├── index.js              ← Exporta instancia del chart y update functions
│   │   ├── plugins.js            ← milestonePlugin, goalLinePlugin
│   │   └── options.js            ← Configuración base de Chart.js
│   │
│   ├── ui/
│   │   ├── view.js               ← updateView, updateLabels, updateStats
│   │   ├── inputs.js             ← Sincronización range↔number, event listeners
│   │   └── collapsible.js        ← makeCollapsible, toggleSection
│   │
│   └── managers/
│       ├── manager-factory.js    ← Clase/función genérica para CRUD managers
│       ├── periods.js            ← Periodos de aporte mensual
│       ├── goals.js              ← Metas financieras
│       ├── pauses.js             ← Años de pausa
│       ├── events.js             ← Eventos y retiros
│       └── extraordinary.js     ← Aportes extraordinarios
│
├── package.json                  ← Vite + Vitest
├── vite.config.js
└── REFACTOR_PLAN.md              ← Este archivo
```

---

## Descripción de cada módulo

### `config.js`
Única fuente de verdad para constantes de la aplicación.
```js
export const STORAGE_KEY = 'financialFortressSettings';
export const DEFAULT_SETTINGS = { ... };
export const MILESTONES = [100_000, 250_000, 500_000, 1_000_000];
```

### `core/simulation.js`
El motor de cálculo **puro** — sin referencias al DOM ni a Chart.js. Recibe parámetros, devuelve datos.
```js
export function simulate({ initialInvestment, annualRate, years, ... }) {
  // Lógica de interés compuesto, retiros, pausas
  return { balances, contributions, interests, isValid };
}
```
**Beneficio clave**: se puede testear de forma unitaria sin browser.

### `core/storage.js`
Todo lo relacionado con persistencia y sharing.
```js
export function loadSettings() { ... }
export function saveSettings(settings) { ... }
export function generateShareURL(settings) { ... }
export function loadFromURL() { ... }
```

### `core/utils.js`
Funciones puras de formato.
```js
export function formatCurrency(value, decimals) { ... }
export function formatShortThreshold(value) { ... }
```

### `chart/plugins.js`
Plugins de Chart.js aislados y testeables.
```js
export const milestonePlugin = { id: 'milestonePlugin', ... };
export const goalLinePlugin = { id: 'goalLinePlugin', ... };
```

### `chart/index.js`
Crea y exporta la instancia del chart. Expone función de update.
```js
export function createChart(ctx, plugins) { ... }
export function updateChartData(chart, pessimisticData, optimisticData) { ... }
```

### `ui/view.js`
Orquesta la actualización visual: llama a `simulate()`, actualiza el chart, actualiza las tarjetas de estadísticas.
```js
export function updateView(settings) {
  const pessimistic = simulate({ ...settings, rate: settings.pessimisticRate });
  const optimistic  = simulate({ ...settings, rate: settings.optimisticRate });
  updateChartData(chart, pessimistic, optimistic);
  updateStatsCards(pessimistic, optimistic, settings);
}
```

### `ui/inputs.js`
Toda la lógica de sincronización de inputs y sus event listeners. Al cambiar un input, llama a `updateView`.

### `managers/manager-factory.js`
**El cambio más importante para reducir código repetitivo.** Los 5 data managers son casi idénticos. Se crea una función/clase genérica:

```js
export function createManager({ storageKey, containerId, fields, onUpdate }) {
  let items = loadItems(storageKey);

  function render() { /* genera HTML genérico para la lista */ }
  function add(item) { items = [...items, item]; save(); onUpdate(); }
  function remove(id) { items = items.filter(i => i.id !== id); save(); onUpdate(); }
  function edit(id, updated) { /* merge */ save(); onUpdate(); }

  return { render, add, remove, edit, getItems: () => items };
}
```

Cada manager concreto solo define sus `fields` específicos:
```js
// managers/goals.js
export const goalsManager = createManager({
  storageKey: 'goals',
  containerId: 'goalsList',
  fields: [
    { name: 'amount', label: 'Monto objetivo', type: 'number' },
    { name: 'label',  label: 'Nombre',         type: 'text' },
  ],
  onUpdate: () => triggerViewUpdate(),
});
```

### `main.js`
Entry point que conecta todos los módulos:
```js
import { loadSettings, saveSettings } from './core/storage.js';
import { updateView } from './ui/view.js';
import { setupInputListeners } from './ui/inputs.js';
import { periodsManager, goalsManager, ... } from './managers/index.js';

const settings = loadSettings();
setupInputListeners({ onUpdate: updateView, onSave: saveSettings });
[periodsManager, goalsManager, ...].forEach(m => m.render());
updateView(settings);
```

---

## Plan de migración por fases

### Fase 1 — Extracción sin romper nada (1–2 horas)
Extraer los módulos más independientes primero:
- [ ] Crear `src/core/utils.js` — copiar `formatCurrency`, `formatShortThreshold`
- [ ] Crear `src/core/simulation.js` — copiar `simulate()`, verificar que no tiene dependencias DOM
- [ ] Crear `src/config.js` — extraer `STORAGE_KEY` y `DEFAULT_SETTINGS`
- [ ] Crear `src/styles/` — dividir el bloque `<style>` en los 5 archivos CSS
- [ ] Configurar Vite y verificar que el proyecto arranca igual

### Fase 2 — Chart aislado (1–2 horas)
- [ ] Crear `src/chart/plugins.js` — `milestonePlugin`, `goalLinePlugin`
- [ ] Crear `src/chart/options.js` — configuración base de Chart.js
- [ ] Crear `src/chart/index.js` — instancia del chart, función de update

### Fase 3 — UI separada (2–3 horas)
- [ ] Crear `src/ui/view.js` — `updateView`, `updateLabels`, `updateStatsDescription`
- [ ] Crear `src/ui/inputs.js` — sincronización de inputs y event listeners
- [ ] Crear `src/ui/collapsible.js` — `makeCollapsible`, `toggleSection`

### Fase 4 — Manager factory (2–3 horas)
- [ ] Crear `src/managers/manager-factory.js` — lógica genérica de CRUD
- [ ] Refactorizar los 5 managers usando la factory
- [ ] Crear `src/managers/index.js` — exporta todos los managers

### Fase 5 — Storage y main (1 hora)
- [ ] Crear `src/core/storage.js` — `loadSettings`, `saveSettings`, `generateShareURL`, `loadFromURL`
- [ ] Crear `src/main.js` — conectar todo
- [ ] Limpiar `index.html` — dejar solo estructura HTML + `<script type="module" src="src/main.js">`

---

## Reducción de código estimada

| Área | Antes | Después |
|------|-------|---------|
| Data Managers (×5) | ~400 líneas | ~80 líneas (factory) + ~25 por manager |
| CSS | 194 líneas mezcladas | 5 archivos de ~40 líneas c/u |
| Archivo más largo | 2,022 líneas | ~150 líneas (view.js) |
| Scope global | Todo | Solo `main.js` orquesta |

---

## Dependencias a agregar

```json
{
  "devDependencies": {
    "vite": "^6.0.0",
    "vitest": "^3.0.0"    // opcional, para tests unitarios de simulate()
  }
}
```

Chart.js puede seguir cargando desde CDN o instalarse como npm package:
```bash
npm install chart.js
```

---

## Comandos de desarrollo

```bash
npm install
npm run dev      # dev server en localhost:5173
npm run build    # genera dist/ para producción
npm run test     # corre tests de simulate() con Vitest (opcional)
```

---

## Decisiones de diseño

**¿Por qué no usar React/Vue?**
La aplicación no tiene componentes con estado complejo que justifiquen un framework reactivo. La lógica es principalmente: "el usuario cambia un input → recalcular y redibujar". Vanilla JS modular es suficiente y más liviano.

**¿Por qué Vite y no Webpack?**
Vite tiene configuración cero para proyectos vanilla JS, arranca en milisegundos en dev, y genera bundles optimizados. Para un proyecto de este tamaño es ideal.

**¿Por qué una manager-factory en lugar de una clase?**
El patrón factory funciona bien con ES6 modules y evita el `this` binding. Pero si se prefiere OOP, `class DataManager` funciona igual — es una decisión de estilo.

**¿Se puede hacer sin Vite (Camino A)?**
Sí. Separar en archivos y cargar con `<script type="module">` funciona en browsers modernos sin ningún build step. La limitación es que no funciona con `file://` (necesita un servidor HTTP, aunque sea `python -m http.server`).
