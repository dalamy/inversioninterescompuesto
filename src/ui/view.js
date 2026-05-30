import { THRESHOLD_TARGETS } from '../config.js';
import { simulate } from '../core/simulation.js';
import { readControlSettings } from '../core/state.js';
import { byRangeStart, formatCurrency, formatShortThreshold, getRangeEnd, getRangeStart } from '../core/utils.js';
import { updateChartData } from '../chart/index.js';

export const createViewController = ({ appState, chart, initialSettings }) => {
    let latestSimulation = { data: [] };
    let thresholdMarkers = [];

    const getStats = () => ({
        pessimisticBalance: document.getElementById('pessimisticBalance'),
        optimisticBalance: document.getElementById('optimisticBalance'),
        totalContributions: document.getElementById('totalContributions'),
        pessimisticGain: document.getElementById('pessimisticGain'),
        optimisticGain: document.getElementById('optimisticGain'),
        pessimisticGoal: document.getElementById('pessimisticGoal'),
        optimisticGoal: document.getElementById('optimisticGoal'),
        pessimisticRent: document.getElementById('pessimisticRent'),
        optimisticRent: document.getElementById('optimisticRent'),
    });

    const updateThresholdMarkers = (data) => {
        thresholdMarkers = THRESHOLD_TARGETS.map((value) => {
            const index = data.findIndex((row) => row.balance >= value);
            if (index === -1) return null;
            return { value, index, label: formatShortThreshold(value) };
        }).filter(Boolean);
    };

    const updateStatsDescription = () => {
        const descElement = document.querySelector('#statsDescription p');
        if (!descElement) return;

        const currentSettings = readControlSettings(initialSettings);
        const stats = getStats();
        const totalContributed = stats.totalContributions.textContent;
        const pessimisticBalance = stats.pessimisticBalance.textContent;
        const optimisticBalance = stats.optimisticBalance.textContent;
        const pessimisticGain = stats.pessimisticGain.textContent;
        const optimisticGain = stats.optimisticGain.textContent;
        const totalWithdrawals = window.pessimisticSimResult?.totalWithdrawals || 0;

        let description = `Comenzaste con <strong style="color: #6c8bff; font-size: 1.1em;">${formatCurrency(currentSettings.initialInvestment)}</strong> de capital inicial. `;

        if (appState.monthlyContributionPeriods.length > 0) {
            description += `Durante estos <strong style="color: #9c6bff;">${currentSettings.yearsSimulation} años</strong>, realizaste aportes mensuales: `;
            appState.monthlyContributionPeriods.sort((a, b) => a.startYear - b.startYear);
            const periodDescriptions = appState.monthlyContributionPeriods.map((period) => {
                if (period.startYear === period.endYear) {
                    return `<strong style="color: #9c6bff;">${formatCurrency(period.amount)}/mes</strong> en el año ${period.startYear}`;
                }
                return `<strong style="color: #9c6bff;">${formatCurrency(period.amount)}/mes</strong> del año ${period.startYear} al ${period.endYear}`;
            });
            description += `${periodDescriptions.join(', ')}. `;
        }

        if (appState.pauseYears.length > 0) {
            const pauseDescriptions = appState.pauseYears.map((pause) => {
                const start = getRangeStart(pause);
                const end = getRangeEnd(pause);
                return start === end ? `año ${start}` : `años ${start}-${end}`;
            });
            description += `Pausaste aportes en: <strong style="color: #6c8bff;">${pauseDescriptions.join(', ')}</strong>. `;
        }

        if (appState.extraordinaryContributions.length > 0) {
            appState.extraordinaryContributions.sort(byRangeStart);
            const contributionDescriptions = appState.extraordinaryContributions.map((contribution) => {
                const start = getRangeStart(contribution);
                const end = getRangeEnd(contribution);
                const period = start === end ? `año ${start}` : `años ${start}-${end}`;
                return `<strong style="color: #6cff8b;">${formatCurrency(contribution.amount)}</strong> en ${period}`;
            });
            description += `Aportes extraordinarios de ${contributionDescriptions.join(', ')}. `;
        }

        if (appState.events.length > 0) {
            appState.events.sort(byRangeStart);
            const eventDescriptions = appState.events.map((event) => {
                const start = getRangeStart(event);
                const end = getRangeEnd(event);
                const period = start === end ? `año ${start}` : `años ${start}-${end}`;
                return `<strong style="color: #ff6e95;">${formatCurrency(event.amount)}</strong> en ${period}`;
            });
            description += `Realizaste retiros de ${eventDescriptions.join(', ')} que pudieron haber sido para <em style="color: #ffa500;">viajes/vacaciones, compras importantes, cambio de auto, emergencias u otros gastos significativos</em>. `;
        }

        description += `<br><br><strong>Rendimientos aplicados:</strong> Tu inversión creció con dos escenarios: un rendimiento <strong style="color: #ff6e95;">${currentSettings.annualPercentagePessimistic}% anual</strong> (escenario pesimista/conservador) y un rendimiento <strong style="color: #6cff8b;">${currentSettings.annualPercentageOptimistic}% anual</strong> (escenario optimista). Estos porcentajes se componen mensualmente, maximizando el efecto del interés compuesto sobre tus aportes regulares.`;

        const withdrawalsText =
            totalWithdrawals > 0
                ? ` (total retirado: <strong style="color: #ff6e95;">${formatCurrency(totalWithdrawals)}</strong>)`
                : '';
        description += `<br><br><strong>Resultado final:</strong> Con un total aportado de <strong style="color: #ffb86c; font-size: 1.15em;">${totalContributed}</strong>${withdrawalsText}, alcanzarías entre <strong style="color: #ff6e95; font-size: 1.15em;">${pessimisticBalance}</strong> (pesimista, ganancia de <strong style="color: #ff6e95;">${pessimisticGain}</strong>) y <strong style="color: #6cff8b; font-size: 1.15em;">${optimisticBalance}</strong> (optimista, ganancia de <strong style="color: #6cff8b;">${optimisticGain}</strong>).`;

        descElement.innerHTML = description;
    };

    const updateView = () => {
        const currentSettings = readControlSettings(initialSettings);
        const stats = getStats();

        const pessimisticSim = simulate({
            initialInvestment: currentSettings.initialInvestment,
            annualPercentage: currentSettings.annualPercentagePessimistic,
            yearsSimulation: currentSettings.yearsSimulation,
            monthlyContributionPeriods: appState.monthlyContributionPeriods,
            initialAge: currentSettings.initialAge,
            events: appState.events,
            pauseYears: appState.pauseYears,
            extraordinaryContributions: appState.extraordinaryContributions,
        });

        const optimisticSim = simulate({
            initialInvestment: currentSettings.initialInvestment,
            annualPercentage: currentSettings.annualPercentageOptimistic,
            yearsSimulation: currentSettings.yearsSimulation,
            monthlyContributionPeriods: appState.monthlyContributionPeriods,
            initialAge: currentSettings.initialAge,
            events: appState.events,
            pauseYears: appState.pauseYears,
            extraordinaryContributions: appState.extraordinaryContributions,
        });

        latestSimulation = optimisticSim;
        window.pessimisticSimData = pessimisticSim.data;
        window.optimisticSimData = optimisticSim.data;
        window.pessimisticSimResult = pessimisticSim;
        window.optimisticSimResult = optimisticSim;

        updateThresholdMarkers(optimisticSim.data);
        updateChartData({ chart, pessimisticSim, optimisticSim });

        const invalidWarning = document.getElementById('invalidWarning');
        if (invalidWarning) {
            invalidWarning.style.display =
                pessimisticSim.hasInvalidWithdrawal || optimisticSim.hasInvalidWithdrawal ? 'block' : 'none';
        }

        const pessimisticDiff = pessimisticSim.finalBalance - pessimisticSim.totalContributions;
        const optimisticDiff = optimisticSim.finalBalance - optimisticSim.totalContributions;
        const pessimisticPercent = ((pessimisticDiff / pessimisticSim.totalContributions) * 100).toFixed(1);
        const optimisticPercent = ((optimisticDiff / optimisticSim.totalContributions) * 100).toFixed(1);
        const pessimisticSign = pessimisticDiff >= 0 ? '+' : '';
        const optimisticSign = optimisticDiff >= 0 ? '+' : '';

        stats.pessimisticBalance.textContent = formatCurrency(pessimisticSim.finalBalance);
        stats.pessimisticGain.textContent = `${pessimisticSign}${formatCurrency(pessimisticDiff)} (${pessimisticSign}${pessimisticPercent}%)`;
        stats.optimisticBalance.textContent = formatCurrency(optimisticSim.finalBalance);
        stats.optimisticGain.textContent = `${optimisticSign}${formatCurrency(optimisticDiff)} (${optimisticSign}${optimisticPercent}%)`;
        stats.totalContributions.textContent = formatCurrency(pessimisticSim.totalContributions);

        let pessimisticGoalText = '';
        appState.goals.forEach((goal) => {
            const goalIndex = pessimisticSim.data.findIndex((row) => row.balance >= goal.amount);
            if (goalIndex !== -1) {
                const yearsToGoal = Math.floor(pessimisticSim.data[goalIndex].month / 12);
                const ageAtGoal = Math.floor(currentSettings.initialAge + yearsToGoal);
                pessimisticGoalText += `${goal.name}: ${yearsToGoal} años (${ageAtGoal} años)\n`;
            } else {
                pessimisticGoalText += `${goal.name}: No alcanzado\n`;
            }
        });
        stats.pessimisticGoal.innerHTML = pessimisticGoalText.trim().replace(/\n/g, '<br>');

        let optimisticGoalText = '';
        appState.goals.forEach((goal) => {
            const goalIndex = optimisticSim.data.findIndex((row) => row.balance >= goal.amount);
            if (goalIndex !== -1) {
                const yearsToGoal = Math.floor(optimisticSim.data[goalIndex].month / 12);
                const ageAtGoal = Math.floor(currentSettings.initialAge + yearsToGoal);
                optimisticGoalText += `${goal.name}: ${yearsToGoal} años (${ageAtGoal} años)\n`;
            } else {
                optimisticGoalText += `${goal.name}: No alcanzado\n`;
            }
        });
        stats.optimisticGoal.innerHTML = optimisticGoalText.trim().replace(/\n/g, '<br>');

        stats.pessimisticRent.textContent = formatCurrency((pessimisticSim.finalBalance * 0.04) / 12);
        stats.optimisticRent.textContent = formatCurrency((optimisticSim.finalBalance * 0.04) / 12);

        updateStatsDescription();
    };

    return {
        getLatestSimulation: () => latestSimulation,
        getThresholdMarkers: () => thresholdMarkers,
        updateView,
        updateStatsDescription,
    };
};
