import { formatDecimalLabel } from './utils.js';

export function simulate({
    initialInvestment,
    annualPercentage,
    yearsSimulation,
    monthlyContributionPeriods,
    initialAge,
    events = [],
    pauseYears = [],
    extraordinaryContributions = [],
}) {
    const months = yearsSimulation * 12;
    const monthlyRate = annualPercentage / 100 / 12;
    let balance = initialInvestment;
    const data = [];
    const contributionLine = [];
    let cumulativeContributions = initialInvestment;
    let hasInvalidWithdrawal = false;
    let totalWithdrawals = 0;

    const eventsByYear = {};
    events.forEach((event) => {
        const startYear = event.startYear ?? event.year;
        const endYear = event.endYear ?? event.year;
        for (let y = startYear; y <= endYear; y += 1) {
            eventsByYear[y] = (eventsByYear[y] || 0) + event.amount;
        }
    });

    const contributionsByYear = {};
    extraordinaryContributions.forEach((contribution) => {
        const startYear = contribution.startYear ?? contribution.year;
        const endYear = contribution.endYear ?? contribution.year;
        for (let y = startYear; y <= endYear; y += 1) {
            contributionsByYear[y] = (contributionsByYear[y] || 0) + contribution.amount;
        }
    });

    const pausedYearsSet = new Set();
    pauseYears.forEach((pause) => {
        const startYear = pause.startYear ?? pause;
        const endYear = pause.endYear ?? pause;
        for (let y = startYear; y <= endYear; y += 1) {
            pausedYearsSet.add(y);
        }
    });

    const getMonthlyContribution = (year) => {
        for (const period of monthlyContributionPeriods) {
            if (year >= period.startYear && year <= period.endYear) {
                return period.amount;
            }
        }
        return 0;
    };

    for (let month = 0; month <= months; month += 1) {
        const yearValue = month / 12;
        const flooredYear = Math.floor(yearValue);
        const yearLabel =
            month % 12 === 0 ? `${flooredYear}a · ${Math.floor(initialAge + flooredYear)}a` : '';
        const ageValue = initialAge + month / 12;
        const ageLabel = formatDecimalLabel(ageValue);

        const isPaused = pausedYearsSet.has(flooredYear);
        const baseMonthlyContribution = getMonthlyContribution(flooredYear);
        const monthlyAddOns = isPaused ? 0 : baseMonthlyContribution;

        let invalidWithdrawal = false;
        if (month % 12 === 0 && eventsByYear[flooredYear]) {
            const withdrawalAmount = eventsByYear[flooredYear];
            totalWithdrawals += withdrawalAmount;
            if (withdrawalAmount > balance) {
                hasInvalidWithdrawal = true;
                invalidWithdrawal = true;
            }
            balance = Math.max(0, balance - withdrawalAmount);
        }

        if (month % 12 === 0 && contributionsByYear[flooredYear]) {
            balance += contributionsByYear[flooredYear];
            cumulativeContributions += contributionsByYear[flooredYear];
        }

        data.push({
            yearLabel,
            month,
            tooltipLabel: `${formatDecimalLabel(yearValue)}a · ${ageLabel} años`,
            balance,
            ageValue,
            ageLabel,
            monthlyContribution: Math.round(monthlyAddOns),
            hasEvent: Boolean(month % 12 === 0 && eventsByYear[flooredYear]),
            eventAmount: (month % 12 === 0 && eventsByYear[flooredYear]) || 0,
            invalidWithdrawal,
            hasContribution: Boolean(month % 12 === 0 && contributionsByYear[flooredYear]),
            contributionAmount: (month % 12 === 0 && contributionsByYear[flooredYear]) || 0,
        });
        contributionLine.push(cumulativeContributions);

        if (month === months) break;
        balance *= 1 + monthlyRate;
        balance += monthlyAddOns;
        cumulativeContributions += monthlyAddOns;
    }

    const finalBalance = Math.round(balance);
    const totalContributions = cumulativeContributions;
    const totalInterest = finalBalance - totalContributions;

    return {
        data,
        contributionLine,
        finalBalance,
        totalContributions,
        totalInterest,
        hasInvalidWithdrawal,
        totalWithdrawals,
    };
}
