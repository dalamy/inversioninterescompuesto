import './styles/base.css';
import './styles/layout.css';
import './styles/controls.css';
import './styles/chart.css';
import './styles/collapsible.css';

import { createChart } from './chart/index.js';
import { applySettingsToControls, buildSettingsPayload, createAppState } from './core/state.js';
import { generateShareURL, loadInitialSettings, saveSettings } from './core/storage.js';
import { createManagers } from './managers/index.js';
import { makeCollapsible } from './ui/collapsible.js';
import { setupInputListeners, updateLabels } from './ui/inputs.js';
import { createViewController } from './ui/view.js';

const initialSettings = loadInitialSettings();
const appState = createAppState(initialSettings);

let viewController;

const persistSettings = () => {
    saveSettings(buildSettingsPayload(appState, initialSettings));
};

const handleUpdate = () => {
    updateLabels();
    viewController.updateView();
    persistSettings();
};

const chart = createChart({
    canvas: document.getElementById('growthChart'),
    getGoals: () => appState.goals,
    getThresholdMarkers: () => viewController?.getThresholdMarkers() || [],
    getLatestSimulation: () => viewController?.getLatestSimulation() || { data: [] },
});

viewController = createViewController({ appState, chart, initialSettings });

makeCollapsible();
applySettingsToControls(initialSettings);

const managers = createManagers({ appState, onChange: handleUpdate });
managers.forEach((manager) => {
    manager.attach();
    manager.render();
});

setupInputListeners({ onInput: handleUpdate });

updateLabels();
viewController.updateView();
persistSettings();

document.getElementById('shareBtn').addEventListener('click', () => {
    const shareURL = generateShareURL(buildSettingsPayload(appState, initialSettings));

    navigator.clipboard
        .writeText(shareURL)
        .then(() => {
            const feedback = document.getElementById('shareFeedback');
            feedback.style.opacity = '1';
            setTimeout(() => {
                feedback.style.opacity = '0';
            }, 3000);
        })
        .catch((error) => {
            console.error('Failed to copy to clipboard', error);
            alert(`Link generado: ${shareURL}`);
        });
});
