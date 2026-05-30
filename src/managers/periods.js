import { byRangeStart, formatCurrency } from '../core/utils.js';
import { createManager } from './manager-factory.js';
import { editRemoveButtons, getNumericValue, getOptionalYearEnd, rangeValidation, resetFields } from './rendering.js';

export const createPeriodsManager = ({ appState, onChange }) =>
    createManager({
        appState,
        stateKey: 'monthlyContributionPeriods',
        containerId: 'monthlyContributionPeriodsList',
        addButtonId: 'addPeriodBtn',
        emptyText: 'Sin periodos definidos',
        sort: byRangeStart,
        renderItem: (period, index) => `
            <div class="manager-row manager-row-period">
                <div>
                    <span class="manager-title">Años ${period.startYear} - ${period.endYear}</span>
                    <span class="manager-meta">${formatCurrency(period.amount)}/mes</span>
                </div>
                ${editRemoveButtons(index)}
            </div>
        `,
        readForm: () => {
            const startYear = getNumericValue('periodStartYear', (value) => parseInt(value, 10));
            const endYear = getOptionalYearEnd('periodEndYear', startYear);
            const amount = getNumericValue('periodAmount');
            return { startYear, endYear, amount };
        },
        fillForm: (period) => {
            document.getElementById('periodStartYear').value = period.startYear;
            document.getElementById('periodEndYear').value = period.endYear;
            document.getElementById('periodAmount').value = period.amount;
        },
        clearForm: () => resetFields('periodStartYear', 'periodEndYear', 'periodAmount'),
        validate: (period) => rangeValidation(period),
        getButtonStyles: (mode) =>
            mode === 'edit'
                ? { text: '✓ Actualizar', style: { background: '#ffa500' } }
                : { text: '+ Agregar', style: { background: '#9c6bff', color: '#fff' } },
        onChange,
    });
