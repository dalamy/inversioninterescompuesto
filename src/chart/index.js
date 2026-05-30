import { createChartOptions } from './options.js';
import { createGoalLinePlugin, createMilestonePlugin } from './plugins.js';

let chartInstance = null;

export const createChart = ({ canvas, getGoals, getThresholdMarkers, getLatestSimulation }) => {
    const Chart = window.Chart;
    if (!Chart) {
        throw new Error('Chart.js is required before src/main.js');
    }

    Chart.register(
        createMilestonePlugin({ getThresholdMarkers }),
        createGoalLinePlugin({ getGoals }),
    );

    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Escenario pesimista',
                    data: [],
                    borderWidth: 3,
                    borderColor: '#ff6e95',
                    backgroundColor: 'rgba(255, 110, 149, 0.1)',
                    tension: 0.35,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    label: 'Escenario optimista',
                    data: [],
                    borderWidth: 3,
                    borderColor: '#6cff8b',
                    backgroundColor: 'rgba(108, 255, 139, 0.1)',
                    tension: 0.35,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    label: 'Total aportado',
                    data: [],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 184, 108, 0.8)',
                    backgroundColor: 'rgba(255, 184, 108, 0.15)',
                    tension: 0.35,
                    pointRadius: 0,
                    borderDash: [6, 4],
                    fill: false,
                },
            ],
        },
        options: createChartOptions({
            getLatestSimulation,
            getChart: () => chartInstance,
        }),
    });

    return chartInstance;
};

export const updateChartData = ({ chart, pessimisticSim, optimisticSim }) => {
    chart.data.labels = pessimisticSim.data.map((row) => row.yearLabel);
    chart.data.datasets[0].data = pessimisticSim.data.map((row) => row.balance);
    chart.data.datasets[1].data = optimisticSim.data.map((row) => row.balance);
    chart.data.datasets[2].data = pessimisticSim.contributionLine;
    chart.update('none');
};
