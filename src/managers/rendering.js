export const editRemoveButtons = (index) => `
    <div>
        <button type="button" data-manager-action="edit" data-index="${index}" class="edit-btn">✎ Editar</button>
        <button type="button" data-manager-action="remove" data-index="${index}" class="remove-btn">✕</button>
    </div>
`;

export const resetFields = (...ids) => {
    ids.forEach((id) => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
};

export const getNumericValue = (id, parser = parseFloat) => parser(document.getElementById(id).value);

export const getOptionalYearEnd = (id, fallback) => {
    const value = document.getElementById(id).value;
    return value ? parseInt(value, 10) : fallback;
};

export const rangeValidation = ({ startYear, endYear, amount, requirePositiveAmount = false }) => {
    if (Number.isNaN(startYear) || (amount !== undefined && Number.isNaN(amount))) {
        return 'Por favor, ingresa valores válidos';
    }

    if (amount !== undefined && (requirePositiveAmount ? amount <= 0 : amount < 0)) {
        return 'Por favor, ingresa valores válidos';
    }

    if (endYear < startYear) {
        return 'El año final no puede ser menor que el año inicial';
    }

    return '';
};
