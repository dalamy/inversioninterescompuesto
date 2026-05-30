import { alignToStep, clampValue } from '../core/utils.js';

export const getInputRefs = () => ({
    inputs: {
        initialInvestment: document.getElementById('initialInvestment'),
        annualPercentagePessimistic: document.getElementById('annualPercentagePessimistic'),
        annualPercentageOptimistic: document.getElementById('annualPercentageOptimistic'),
        yearsSimulation: document.getElementById('yearsSimulation'),
        initialAge: document.getElementById('initialAge'),
    },
    numberInputs: {
        yearsSimulation: document.getElementById('yearsSimulationNumber'),
    },
    freeInputs: {
        initialInvestment: document.getElementById('initialInvestmentNumber'),
        annualPercentagePessimistic: document.getElementById('annualPercentagePessimisticNumber'),
        annualPercentageOptimistic: document.getElementById('annualPercentageOptimisticNumber'),
    },
});

export const updateLabels = () => {
    const labelElements = {
        initialInvestment: document.getElementById('initialInvestmentLabel'),
        annualPercentagePessimistic: document.getElementById('annualPercentagePessimisticLabel'),
        annualPercentageOptimistic: document.getElementById('annualPercentageOptimisticLabel'),
        yearsSimulation: document.getElementById('yearsSimulationLabel'),
        initialAge: document.getElementById('initialAgeLabel'),
    };

    const inputElements = {
        initialInvestment: document.getElementById('initialInvestmentNumber'),
        annualPercentagePessimistic: document.getElementById('annualPercentagePessimisticNumber'),
        annualPercentageOptimistic: document.getElementById('annualPercentageOptimisticNumber'),
        yearsSimulation: document.getElementById('yearsSimulation'),
        initialAge: document.getElementById('initialAge'),
    };

    if (labelElements.initialInvestment && inputElements.initialInvestment) {
        labelElements.initialInvestment.textContent = `$${Number(inputElements.initialInvestment.value).toLocaleString('en-US')}`;
    }
    if (labelElements.annualPercentagePessimistic && inputElements.annualPercentagePessimistic) {
        labelElements.annualPercentagePessimistic.textContent = `${parseFloat(inputElements.annualPercentagePessimistic.value).toFixed(1)} %`;
    }
    if (labelElements.annualPercentageOptimistic && inputElements.annualPercentageOptimistic) {
        labelElements.annualPercentageOptimistic.textContent = `${parseFloat(inputElements.annualPercentageOptimistic.value).toFixed(1)} %`;
    }
    if (labelElements.yearsSimulation && inputElements.yearsSimulation) {
        labelElements.yearsSimulation.textContent = `${inputElements.yearsSimulation.value} años`;
    }
    if (labelElements.initialAge && inputElements.initialAge) {
        labelElements.initialAge.textContent = `${inputElements.initialAge.value} años`;
    }
};

export const setupInputListeners = ({ onInput }) => {
    const { inputs, numberInputs, freeInputs } = getInputRefs();

    Object.entries(numberInputs).forEach(([key, numberField]) => {
        const rangeField = inputs[key];
        if (!rangeField || !numberField) return;

        rangeField.addEventListener('input', () => {
            numberField.value = rangeField.value;
            onInput();
        });

        numberField.addEventListener('input', () => {
            const min = Number(rangeField.min);
            const max = Number(rangeField.max);
            const current = Number(numberField.value);
            if (!Number.isFinite(current)) return;
            const clamped = clampValue(current, min, max);
            const aligned = alignToStep(clamped, rangeField.step);
            const finalValue = clampValue(aligned, min, max);
            rangeField.value = finalValue;
            numberField.value = finalValue;
            onInput();
        });
    });

    Object.entries(freeInputs).forEach(([key, numberField]) => {
        const rangeField = inputs[key];
        if (!rangeField || !numberField) return;

        rangeField.addEventListener('input', () => {
            numberField.value = rangeField.value;
            onInput();
        });

        numberField.addEventListener('input', () => {
            const current = Number(numberField.value);
            if (!Number.isFinite(current)) return;
            rangeField.value = current;
            onInput();
        });
    });

    if (inputs.initialAge) {
        inputs.initialAge.addEventListener('input', onInput);
    }
};
