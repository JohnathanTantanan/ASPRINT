function cancelEdit(formId, originalValues, displayElementsIds, editButtonId) {
    const form = document.getElementById(formId);

    // Reset the form fields to the original values
    for (const [field, value] of Object.entries(originalValues)) {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            input.value = value;
        }
    }

    // Hide the form
    form.style.display = 'none';

    // Show the display elements
    displayElementsIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'block';
        }
    });

    // Show the edit button
    const editButton = document.getElementById(editButtonId);
    if (editButton) {
        editButton.style.display = 'inline-block';
    }
}