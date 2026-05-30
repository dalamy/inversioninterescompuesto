import { GOAL_COLORS } from '../config.js';
import { formatCurrency } from '../core/utils.js';

export const createMilestonePlugin = ({ getThresholdMarkers }) => ({
    id: 'milestoneLines',
    afterDatasetsDraw(chart) {
        const thresholdMarkers = getThresholdMarkers();
        if (!thresholdMarkers.length) return;

        const { ctx } = chart;
        const yScale = chart.scales.y;
        const meta = chart.getDatasetMeta(0);

        ctx.save();
        thresholdMarkers.forEach((marker) => {
            const point = meta.data[marker.index];
            if (!point) return;

            ctx.strokeStyle = 'rgba(255, 110, 149, 0.7)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(point.x, yScale.top);
            ctx.lineTo(point.x, yScale.bottom);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#ff6e95';
            ctx.font = '12px Space Grotesk, system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(marker.label, point.x, yScale.top + 16);
        });
        ctx.restore();
    },
});

export const createGoalLinePlugin = ({ getGoals }) => ({
    id: 'goalLine',
    afterDatasetsDraw(chart) {
        const goals = getGoals();
        const { ctx, chartArea, scales } = chart;
        if (!goals || goals.length === 0) return;

        goals.forEach((goal, index) => {
            const goalAmount = goal.amount;
            if (!goalAmount || goalAmount <= 0) return;

            const y = scales.y.getPixelForValue(goalAmount);
            if (y < chartArea.top || y > chartArea.bottom) return;

            const color = GOAL_COLORS[index % GOAL_COLORS.length];

            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 4]);
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.font = 'bold 11px Space Grotesk';
            ctx.textAlign = 'right';
            ctx.fillText(`${goal.name}: ${formatCurrency(goalAmount)}`, chartArea.right - 8, y - 6);
            ctx.restore();
        });
    },
});
