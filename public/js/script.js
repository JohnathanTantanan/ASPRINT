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
$(document).ready(function(){
    function upvotePost(postId){
        // const postId = $(this).attr('postId');
        console.log('Upvoting post:', postId);
        $.ajax({
            url: `/post/upvote/${postId}`,
            method: 'POST',
            success: function(result) {
                if (result.success) {
                    $(this).closest('button').find('.upvote-count').text(result.upvotes);
                }
            }.bind(this),
            error: function(xhr, status, error) {
                console.error('Failed to upvote post:', error);
            }
        });
    }

    $('.upvote-btn').click(function(){
        upvotePost($(this).attr('postId'));
        //console.log('Upvoting post...');
    });
});
