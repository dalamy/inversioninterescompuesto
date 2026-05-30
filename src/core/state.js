export const createAppState = (settings) => ({
    monthlyContributionPeriods: settings.monthlyContributionPeriods || [],
    goals: settings.goals || [],
    events: settings.events || [],
    pauseYears: settings.pauseYears || [],
    extraordinaryContributions: settings.extraordinaryContributions || [],
});

export const readControlSettings = (fallback = {}) => {
    const initialInvestment = document.getElementById('initialInvestmentNumber');
    const annualPercentagePessimistic = document.getElementById('annualPercentagePessimisticNumber');
    const annualPercentageOptimistic = document.getElementById('annualPercentageOptimisticNumber');
    const yearsSimulation = document.getElementById('yearsSimulation');
    const initialAge = document.getElementById('initialAge');

    return {
        initialInvestment: initialInvestment ? Number(initialInvestment.value) : fallback.initialInvestment,
        annualPercentagePessimistic: annualPercentagePessimistic
            ? Number(annualPercentagePessimistic.value)
            : fallback.annualPercentagePessimistic,
        annualPercentageOptimistic: annualPercentageOptimistic
            ? Number(annualPercentageOptimistic.value)
            : fallback.annualPercentageOptimistic,
        yearsSimulation: yearsSimulation ? Number(yearsSimulation.value) : fallback.yearsSimulation,
        initialAge: initialAge ? Number(initialAge.value) : fallback.initialAge,
    };
};

export const buildSettingsPayload = (appState, fallback = {}) => ({
    ...readControlSettings(fallback),
    monthlyContributionPeriods: appState.monthlyContributionPeriods,
    goals: appState.goals,
    events: appState.events,
    pauseYears: appState.pauseYears,
    extraordinaryContributions: appState.extraordinaryContributions,
});

export const applySettingsToControls = (settings) => {
    const controls = {
        initialInvestment: document.getElementById('initialInvestment'),
        initialInvestmentNumber: document.getElementById('initialInvestmentNumber'),
        annualPercentagePessimistic: document.getElementById('annualPercentagePessimistic'),
        annualPercentagePessimisticNumber: document.getElementById('annualPercentagePessimisticNumber'),
        annualPercentageOptimistic: document.getElementById('annualPercentageOptimistic'),
        annualPercentageOptimisticNumber: document.getElementById('annualPercentageOptimisticNumber'),
        yearsSimulation: document.getElementById('yearsSimulation'),
        yearsSimulationNumber: document.getElementById('yearsSimulationNumber'),
        initialAge: document.getElementById('initialAge'),
    };

    controls.initialInvestment.value = settings.initialInvestment;
    controls.initialInvestmentNumber.value = settings.initialInvestment;
    controls.annualPercentagePessimistic.value = settings.annualPercentagePessimistic;
    controls.annualPercentagePessimisticNumber.value = settings.annualPercentagePessimistic;
    controls.annualPercentageOptimistic.value = settings.annualPercentageOptimistic;
    controls.annualPercentageOptimisticNumber.value = settings.annualPercentageOptimistic;
    controls.yearsSimulation.value = settings.yearsSimulation;
    controls.yearsSimulationNumber.value = settings.yearsSimulation;
    controls.initialAge.value = settings.initialAge;
};
