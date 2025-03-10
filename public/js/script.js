function toggleEditMode(editFormId, displayElementsIds, editButtonId) {
    const editForm = document.getElementById(editFormId);
    const editButton = document.getElementById(editButtonId);
    const displayElements = displayElementsIds.map(id => document.getElementById(id));

    if (editForm.style.display === 'none') {
        editForm.style.display = 'block';
        displayElements.forEach(element => element.style.display = 'none');
        editButton.style.display = 'none';
    } else {
        editForm.style.display = 'none';
        displayElements.forEach(element => element.style.display = 'block');
        editButton.style.display = 'inline-block';
    }
}

// JQUERY/AJAX FUNCTIONS
// document.querySelectorAll('.upvote-btn').forEach(button => {
//     button.addEventListener('click', async () => {
//         const postId = button.getAttribute('postId');
//         const response = await fetch(`/post/${postId}/upvote`, { method: 'POST' });
//         const result = await response.json();
//         if (result.success) {
//             button.querySelector('.upvote-count').textContent = result.upvotes;
//         }
//     });
// });