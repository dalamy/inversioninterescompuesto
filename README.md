# 📈 Simulador de Crecimiento Financiero

Una herramienta interactiva y moderna para simular el crecimiento de tus inversiones a largo plazo, visualizando diferentes escenarios y planificando tu futuro financiero.

![Financial Simulator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Características

### 🎯 Simulaciones Duales
- **Escenario Pesimista y Optimista**: Visualiza dos proyecciones simultáneas con diferentes tasas de rendimiento anual
- **Comparación en Tiempo Real**: Observa cómo pequeñas diferencias en retornos generan grandes impactos a largo plazo

### 💰 Gestión de Aportes
- **Aportes Mensuales Progresivos**: Define un aporte mensual inicial y uno final que crece linealmente
- **Aportes Extraordinarios**: Simula ingresos especiales como ventas de propiedades, herencias, bonos
- **Años sin Aportes**: Pausa tus contribuciones en años específicos (ej: períodos de pago de deudas, educación)

### 🎪 Eventos Especiales
- **Retiros Programados**: Simula gastos grandes como compra de auto, entrada de casa, viajes
- **Validación Inteligente**: Sistema que alerta cuando un retiro excede el balance disponible
- **Múltiples Eventos**: Agrega tantos eventos como necesites en diferentes años

### 📊 Visualización Avanzada
- **Gráficos Interactivos**: Visualización con Chart.js mostrando crecimiento proyectado
- **Milestones Automáticos**: Marcadores visuales al alcanzar $100k, $250k, $500k, $1M, $5M, $10M, $20M, $50M
- **Línea de Meta**: Define tu objetivo financiero y visualízalo en el gráfico
- **Tooltips Detallados**: Información completa al pasar el cursor sobre cualquier punto

### 📈 Análisis Financiero
- **Regla del 4%**: Calcula la renta mensual sostenible basada en tu portafolio final
- **Ganancia de Inversión**: Muestra el retorno en dólares y porcentaje para cada escenario
- **Tiempo a la Meta**: Indica cuándo alcanzarás tu objetivo y a qué edad
- **Tracking de Edad**: Visualiza tu edad en cada punto de la simulación

### 💾 Persistencia
- **LocalStorage**: Todos tus parámetros se guardan automáticamente en el navegador
- **Recuperación Automática**: Retoma tu simulación donde la dejaste

## 🚀 Cómo Usar

### Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en tu navegador moderno.

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/FinAnalysis.git

# Navegar al directorio
cd FinAnalysis

# Abrir en el navegador
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Configuración Básica

1. **Capital Inicial**: Define tu inversión inicial (ej: $15,000)
2. **Rendimientos Anuales**: 
   - Pesimista: 6% (conservador)
   - Optimista: 12% (agresivo)
3. **Años de Simulación**: ¿Cuántos años quieres proyectar? (1-60 años)
4. **Edad Inicial**: Tu edad actual para tracking
5. **Aportes Mensuales**: Define el rango de tus contribuciones mensuales
6. **Meta Financiera**: Tu objetivo en dólares

### Funciones Avanzadas

#### Años sin Aportes
Útil para simular períodos donde no puedes contribuir:
- Pago de deudas
- Gastos de educación
- Cambio de carrera
- Licencias sin goce de sueldo

#### Eventos Especiales (Retiros)
Simula gastos grandes:
- $20,000 - Compra de auto en año 3
- $50,000 - Entrada de casa en año 7
- $10,000 - Viaje especial en año 10

#### Aportes Extraordinarios
Simula ingresos especiales:
- $30,000 - Venta de auto en año 5
- $100,000 - Herencia en año 10
- $25,000 - Bonus anual en año 8

## 🎨 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Glassmorphism design, Grid layout, animaciones
- **JavaScript ES6+**: Lógica de simulación y manejo de estado
- **Chart.js v4.x**: Visualización de datos interactiva
- **LocalStorage API**: Persistencia de datos

## 📖 Conceptos Financieros

### Interés Compuesto
El simulador utiliza interés compuesto mensual:
```
Balance_nuevo = Balance_anterior × (1 + tasa_mensual) + aporte_mensual
```

### Regla del 4%
Una regla de retiro segura que sugiere que puedes retirar el 4% anual de tu portafolio sin riesgo de agotarlo:
- Portafolio de $1,000,000
- Retiro anual: $40,000
- Renta mensual: $3,333

**Advertencias**: Esta regla asume crecimiento constante, inflación estable y 30+ años de jubilación.

## 🛠️ Estructura del Proyecto

```
FinAnalysis/
│
├── index.html          # Aplicación completa (HTML + CSS + JS)
├── .gitignore         # Archivos ignorados por Git
└── README.md          # Este archivo
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] Export a PDF
- [ ] Import/Export de configuraciones JSON
- [ ] Ajuste por inflación
- [ ] Cálculos de impuestos
- [ ] Múltiples metas simultáneas
- [ ] Modo comparación de escenarios
- [ ] Integración con datos históricos del mercado
- [ ] Calculadora de jubilación anticipada (FIRE)

## ⚠️ Disclaimer

Esta herramienta es solo para fines educativos y de planificación personal. No constituye asesoría financiera profesional. Los resultados son proyecciones basadas en supuestos y no garantizan rendimientos futuros.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para ayudarte a planificar tu futuro financiero.

---

**⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub!**
