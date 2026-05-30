import { GOAL_COLORS } from '../config.js';
import { formatCurrency } from '../core/utils.js';
import { createManager } from './manager-factory.js';
import { editRemoveButtons, getNumericValue, resetFields } from './rendering.js';

export const createGoalsManager = ({ appState, onChange }) =>
    createManager({
        appState,
        stateKey: 'goals',
        containerId: 'goalsList',
        addButtonId: 'addGoalBtn',
        emptyText: 'Sin objetivos definidos',
        sort: (a, b) => a.amount - b.amount,
        renderItem: (goal, index) => `
            <div class="manager-row" style="border-left-color: ${GOAL_COLORS[index % GOAL_COLORS.length]};">
                <div>
                    <span class="manager-title">${goal.name}</span>
                    <span class="manager-meta">${formatCurrency(goal.amount)}</span>
                </div>
                ${editRemoveButtons(index)}
            </div>
        `,
        readForm: () => ({
            name: document.getElementById('goalName').value.trim(),
            amount: getNumericValue('goalAmount'),
        }),
        fillForm: (goal) => {
            document.getElementById('goalName').value = goal.name;
            document.getElementById('goalAmount').value = goal.amount;
        },
        clearForm: () => resetFields('goalName', 'goalAmount'),
        validate: (goal) =>
            !goal.name || Number.isNaN(goal.amount) || goal.amount <= 0
                ? 'Por favor, ingresa un nombre y un monto válido'
                : '',
        getButtonStyles: (mode) =>
            mode === 'edit'
                ? { text: '✓ Actualizar', style: { background: '#6cff8b', color: '#0a0e27' } }
                : { text: '+ Agregar', style: { background: '#ffa500', color: '#fff' } },
        onChange,
    });
