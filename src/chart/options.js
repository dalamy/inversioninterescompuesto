import { formatCurrency } from '../core/utils.js';

export const createChartOptions = ({ getLatestSimulation, getChart }) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            callbacks: {
                title: (context) => {
                    if (!context.length || !window.pessimisticSimData) return '';
                    const row = window.pessimisticSimData[context[0].dataIndex];
                    return row ? row.tooltipLabel : context[0].label;
                },
                label(context) {
                    const value = context.parsed.y;
                    if (!window.pessimisticSimData) return formatCurrency(value);

                    const dataPoint = window.pessimisticSimData[context.dataIndex];
                    const age = dataPoint ? Math.floor(dataPoint.ageValue) : '';

                    if (context.datasetIndex === 2) {
                        const monthly = dataPoint ? dataPoint.monthlyContribution : 0;
                        return [
                            `${context.dataset.label}: ${formatCurrency(value)}`,
                            `Aporte mensual: ${formatCurrency(monthly)}`,
                        ];
                    }

                    const lines = [`${context.dataset.label}: ${formatCurrency(value)} (${age} años)`];

                    if (dataPoint && dataPoint.hasEvent) {
                        lines.push(`Retiro: ${formatCurrency(dataPoint.eventAmount)}`);
                        if (dataPoint.invalidWithdrawal) {
                            lines.push('RETIRO EXCEDE BALANCE DISPONIBLE');
                        }
                    }

                    if (dataPoint && dataPoint.hasContribution) {
                        lines.push(`Aporte extra: ${formatCurrency(dataPoint.contributionAmount)}`);
                    }

                    return lines;
                },
            },
        },
        legend: { display: false },
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
                color: '#d8e1ff',
                font: { family: 'Space Grotesk', size: 11 },
                maxRotation: 45,
                minRotation: 45,
                autoSkip: false,
                callback(value, index) {
                    const label = this.chart.data.labels[index];
                    return label || '';
                },
            },
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
                color: '#d8e1ff',
                callback: (value) => formatCurrency(value),
                font: { family: 'Space Grotesk' },
            },
        },
    },
    onClick: (event, activeElements) => {
        if (activeElements.length === 0) return;

        const chart = getChart();
        const index = activeElements[0].index;
        const dataPoint = getLatestSimulation().data[index];
        if (!dataPoint) return;

        const pessimisticValue = chart.data.datasets[0].data[index];
        const optimisticValue = chart.data.datasets[1].data[index];
        const contributionValue = chart.data.datasets[2].data[index];
        const age = Math.floor(dataPoint.ageValue);
        const year = Math.floor(dataPoint.month / 12);
        const monthly = dataPoint.monthlyContribution;

        alert(
            `Información del Año ${year} (${age} años)\n\n` +
                `Escenario Pesimista: ${formatCurrency(pessimisticValue)}\n` +
                `Escenario Optimista: ${formatCurrency(optimisticValue)}\n` +
                `Total Aportado: ${formatCurrency(contributionValue)}\n` +
                `Aporte Mensual: ${formatCurrency(monthly)}`,
        );
    },
});
