export const STORAGE_KEY = 'fin-simulator-settings';

export const DEFAULT_SETTINGS = {
    initialInvestment: 10000,
    annualPercentagePessimistic: 8,
    annualPercentageOptimistic: 10,
    yearsSimulation: 30,
    initialAge: 30,
    monthlyContributionPeriods: [{ startYear: 0, endYear: 30, amount: 500 }],
    goals: [
        { name: 'Corto plazo', amount: 100000 },
        { name: 'Mediano plazo', amount: 250000 },
        { name: 'Largo plazo', amount: 500000 },
    ],
    events: [
        { startYear: 1, endYear: 10, amount: 2500 },
        { startYear: 10, endYear: 20, amount: 5000 },
        { startYear: 20, endYear: 30, amount: 7500 },
    ],
    pauseYears: [],
    extraordinaryContributions: [],
};

export const THRESHOLD_TARGETS = [
    100000,
    250000,
    500000,
    1000000,
    5000000,
    10000000,
    20000000,
    50000000,
];

export const GOAL_COLORS = ['#ffa500', '#ff6e95', '#6cff8b', '#6c8bff', '#9c6bff', '#ffb86c'];
