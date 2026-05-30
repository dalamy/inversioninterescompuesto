export function createManager({
    appState,
    stateKey,
    containerId,
    addButtonId,
    emptyText,
    sort,
    renderItem,
    readForm,
    fillForm,
    clearForm,
    validate,
    getButtonStyles,
    onChange,
}) {
    let editingIndex = -1;
    let listenersAttached = false;

    const getItems = () => appState[stateKey];
    const getContainer = () => document.getElementById(containerId);
    const getAddButton = () => document.getElementById(addButtonId);

    const setButtonMode = (mode) => {
        const button = getAddButton();
        if (!button || !getButtonStyles) return;
        const styles = getButtonStyles(mode);
        button.textContent = styles.text;
        Object.entries(styles.style || {}).forEach(([property, value]) => {
            button.style[property] = value;
        });
    };

    const render = () => {
        const container = getContainer();
        if (!container) return;

        const items = getItems();
        if (sort) items.sort(sort);

        if (items.length === 0) {
            container.innerHTML = `<p style="color: #6a7185; font-size: 0.85em; font-style: italic;">${emptyText}</p>`;
            return;
        }

        container.innerHTML = items.map((item, index) => renderItem(item, index)).join('');
    };

    const submit = () => {
        const item = readForm();
        const validationMessage = validate ? validate(item) : '';
        if (validationMessage) {
            alert(validationMessage);
            return;
        }

        if (editingIndex >= 0) {
            getItems()[editingIndex] = item;
            editingIndex = -1;
            setButtonMode('add');
        } else {
            getItems().push(item);
        }

        clearForm();
        render();
        onChange();
    };

    const edit = (index) => {
        editingIndex = index;
        fillForm(getItems()[index]);
        setButtonMode('edit');
    };

    const remove = (index) => {
        getItems().splice(index, 1);
        render();
        onChange();
    };

    const attach = () => {
        if (listenersAttached) return;
        listenersAttached = true;

        const addButton = getAddButton();
        if (addButton) {
            addButton.addEventListener('click', submit);
        }

        const container = getContainer();
        if (container) {
            container.addEventListener('click', (event) => {
                const button = event.target.closest('[data-manager-action]');
                if (!button) return;

                const index = Number(button.dataset.index);
                if (button.dataset.managerAction === 'edit') edit(index);
                if (button.dataset.managerAction === 'remove') remove(index);
            });
        }
    };

    return { attach, render, getItems };
}
