export const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);

export const formatShortThreshold = (value) => {
    if (value >= 1000000) return `$${value / 1000000}M`;
    return `$${value / 1000}k`;
};

export const formatDecimalLabel = (value) => {
    const formatted = Number(value).toFixed(1);
    return formatted.endsWith('.0') ? formatted.replace('.0', '') : formatted;
};

export const clampValue = (value, min, max) => Math.min(max, Math.max(min, value));

export const alignToStep = (value, step) => {
    if (!step) return value;
    const numericStep = Number(step);
    if (!Number.isFinite(numericStep) || numericStep === 0) return value;
    return Math.round(value / numericStep) * numericStep;
};

export const getRangeStart = (item) => item.startYear ?? item.year ?? item;

export const getRangeEnd = (item) => item.endYear ?? item.year ?? item;

export const makeRangeLabel = (item, singular = 'Año', plural = 'Años') => {
    const startYear = getRangeStart(item);
    const endYear = getRangeEnd(item);
    return startYear === endYear ? `${singular} ${startYear}` : `${plural} ${startYear} - ${endYear}`;
};

export const byRangeStart = (a, b) => getRangeStart(a) - getRangeStart(b);
