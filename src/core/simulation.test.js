import { describe, expect, it } from 'vitest';
import { simulate } from './simulation.js';

describe('simulate', () => {
    it('compounds monthly contributions without DOM dependencies', () => {
        const result = simulate({
            initialInvestment: 1000,
            annualPercentage: 12,
            yearsSimulation: 1,
            monthlyContributionPeriods: [{ startYear: 0, endYear: 1, amount: 100 }],
            initialAge: 30,
            events: [],
            pauseYears: [],
            extraordinaryContributions: [],
        });

        expect(result.data).toHaveLength(13);
        expect(result.finalBalance).toBeGreaterThan(2200);
        expect(result.totalContributions).toBe(2200);
        expect(result.hasInvalidWithdrawal).toBe(false);
    });

    it('marks invalid withdrawals and keeps balances non-negative', () => {
        const result = simulate({
            initialInvestment: 1000,
            annualPercentage: 8,
            yearsSimulation: 1,
            monthlyContributionPeriods: [],
            initialAge: 30,
            events: [{ year: 0, amount: 2000 }],
            pauseYears: [],
            extraordinaryContributions: [],
        });

        expect(result.hasInvalidWithdrawal).toBe(true);
        expect(result.data[0].balance).toBe(0);
        expect(result.totalWithdrawals).toBe(2000);
    });
});
