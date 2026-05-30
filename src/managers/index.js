import { createEventsManager } from './events.js';
import { createExtraordinaryManager } from './extraordinary.js';
import { createGoalsManager } from './goals.js';
import { createPausesManager } from './pauses.js';
import { createPeriodsManager } from './periods.js';

export const createManagers = ({ appState, onChange }) => [
    createPeriodsManager({ appState, onChange }),
    createGoalsManager({ appState, onChange }),
    createPausesManager({ appState, onChange }),
    createEventsManager({ appState, onChange }),
    createExtraordinaryManager({ appState, onChange }),
];
