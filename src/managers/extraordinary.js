import { byRangeStart, formatCurrency, getRangeEnd, getRangeStart, makeRangeLabel } from '../core/utils.js';
import { createManager } from './manager-factory.js';
import { editRemoveButtons, getNumericValue, getOptionalYearEnd, rangeValidation, resetFields } from './rendering.js';

export const createExtraordinaryManager = ({ appState, onChange }) =>
    createManager({
        appState,
        stateKey: 'extraordinaryContributions',
        containerId: 'extraordinaryContributionsList',
        addButtonId: 'addContributionBtn',
        emptyText: 'Sin aportes extraordinarios agregados',
        sort: byRangeStart,
        renderItem: (contribution, index) => `
            <div class="manager-row manager-row-contribution">
                <span class="manager-title">${makeRangeLabel(contribution)}: ${formatCurrency(contribution.amount)}</span>
                ${editRemoveButtons(index)}
            </div>
        `,
        readForm: () => {
            const startYear = getNumericValue('contributionYearStart', (value) => parseInt(value, 10));
            const endYear = getOptionalYearEnd('contributionYearEnd', startYear);
            const amount = getNumericValue('contributionAmount');
            return startYear === endYear ? { year: startYear, amount } : { startYear, endYear, amount };
        },
        fillForm: (contribution) => {
            const startYear = getRangeStart(contribution);
            const endYear = getRangeEnd(contribution);
            document.getElementById('contributionYearStart').value = startYear;
            document.getElementById('contributionYearEnd').value = startYear === endYear ? '' : endYear;
            document.getElementById('contributionAmount').value = contribution.amount;
        },
        clearForm: () => resetFields('contributionYearStart', 'contributionYearEnd', 'contributionAmount'),
        validate: (contribution) =>
            rangeValidation({
                startYear: getRangeStart(contribution),
                endYear: getRangeEnd(contribution),
                amount: contribution.amount,
                requirePositiveAmount: true,
            }),
        getButtonStyles: (mode) =>
            mode === 'edit'
                ? { text: '✓ Actualizar', style: { background: '#ffa500', color: '#fff' } }
                : { text: '+ Agregar', style: { background: '#6cff8b', color: '#0a0e27' } },
        onChange,
    });
