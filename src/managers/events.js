import { byRangeStart, formatCurrency, getRangeEnd, getRangeStart, makeRangeLabel } from '../core/utils.js';
import { createManager } from './manager-factory.js';
import { editRemoveButtons, getNumericValue, getOptionalYearEnd, rangeValidation, resetFields } from './rendering.js';

export const createEventsManager = ({ appState, onChange }) =>
    createManager({
        appState,
        stateKey: 'events',
        containerId: 'eventsList',
        addButtonId: 'addEventBtn',
        emptyText: 'Sin eventos agregados',
        sort: byRangeStart,
        renderItem: (event, index) => `
            <div class="manager-row manager-row-event">
                <div>
                    <span class="manager-title">${makeRangeLabel(event)}</span>
                    <span class="manager-meta">${formatCurrency(event.amount)}</span>
                </div>
                ${editRemoveButtons(index)}
            </div>
        `,
        readForm: () => {
            const startYear = getNumericValue('eventYearStart', (value) => parseInt(value, 10));
            const endYear = getOptionalYearEnd('eventYearEnd', startYear);
            const amount = getNumericValue('eventAmount');
            return startYear === endYear ? { year: startYear, amount } : { startYear, endYear, amount };
        },
        fillForm: (event) => {
            const startYear = getRangeStart(event);
            const endYear = getRangeEnd(event);
            document.getElementById('eventYearStart').value = startYear;
            document.getElementById('eventYearEnd').value = startYear === endYear ? '' : endYear;
            document.getElementById('eventAmount').value = event.amount;
        },
        clearForm: () => resetFields('eventYearStart', 'eventYearEnd', 'eventAmount'),
        validate: (event) =>
            rangeValidation({
                startYear: getRangeStart(event),
                endYear: getRangeEnd(event),
                amount: event.amount,
            }),
        getButtonStyles: (mode) =>
            mode === 'edit'
                ? { text: '✓ Actualizar', style: { background: '#ffa500', color: '#fff' } }
                : { text: '+ Agregar', style: { background: '#ff6e95', color: '#fff' } },
        onChange,
    });
