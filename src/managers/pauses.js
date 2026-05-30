import { byRangeStart, getRangeEnd, getRangeStart, makeRangeLabel } from '../core/utils.js';
import { createManager } from './manager-factory.js';
import { editRemoveButtons, getNumericValue, getOptionalYearEnd, rangeValidation, resetFields } from './rendering.js';

export const createPausesManager = ({ appState, onChange }) =>
    createManager({
        appState,
        stateKey: 'pauseYears',
        containerId: 'pauseYearsList',
        addButtonId: 'addPauseYearBtn',
        emptyText: 'Sin años pausados',
        sort: byRangeStart,
        renderItem: (pause, index) => `
            <div class="manager-row manager-row-pause">
                <span class="manager-title">${makeRangeLabel(pause)}</span>
                ${editRemoveButtons(index)}
            </div>
        `,
        readForm: () => {
            const startYear = getNumericValue('pauseYearStart', (value) => parseInt(value, 10));
            const endYear = getOptionalYearEnd('pauseYearEnd', startYear);
            return startYear === endYear ? startYear : { startYear, endYear };
        },
        fillForm: (pause) => {
            const startYear = getRangeStart(pause);
            const endYear = getRangeEnd(pause);
            document.getElementById('pauseYearStart').value = startYear;
            document.getElementById('pauseYearEnd').value = startYear === endYear ? '' : endYear;
        },
        clearForm: () => resetFields('pauseYearStart', 'pauseYearEnd'),
        validate: (pause) =>
            rangeValidation({
                startYear: getRangeStart(pause),
                endYear: getRangeEnd(pause),
            }),
        getButtonStyles: (mode) =>
            mode === 'edit'
                ? { text: '✓ Actualizar', style: { background: '#ffa500', color: '#fff' } }
                : { text: '+ Agregar', style: { background: '#6c8bff', color: '#fff' } },
        onChange,
    });
