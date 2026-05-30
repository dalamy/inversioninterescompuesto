import { DEFAULT_SETTINGS, STORAGE_KEY } from '../config.js';

export const loadFromURL = () => {
    try {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('data')) return null;

        const compressed = params.get('data');
        const decompressed = atob(compressed);
        return JSON.parse(decompressed);
    } catch (error) {
        console.warn('Failed to parse URL parameters', error);
        return null;
    }
};

export const generateShareURL = (settings) => {
    try {
        const json = JSON.stringify(settings);
        const compressed = btoa(json);
        const url = new URL(window.location.href.split('?')[0]);
        url.searchParams.set('data', compressed);
        return url.toString();
    } catch (error) {
        console.error('Failed to generate share URL', error);
        return window.location.href;
    }
};

export const loadSettings = () => {
    try {
        const payload = localStorage.getItem(STORAGE_KEY);
        return payload ? JSON.parse(payload) : {};
    } catch (error) {
        console.warn('Failed to parse stored settings', error);
        return {};
    }
};

export const saveSettings = (settings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const loadInitialSettings = () => {
    const urlSettings = loadFromURL();
    const savedSettings = loadSettings();
    return { ...DEFAULT_SETTINGS, ...savedSettings, ...(urlSettings || {}) };
};
