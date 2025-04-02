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

function previewImage(event) {
    const imageInput = event.target;
    const preview = document.getElementById('image-preview');

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'flex'; // Show the preview image
        };

        reader.readAsDataURL(imageInput.files[0]); // Read the image file as a data URL
    } else {
        preview.src = '#';
        preview.style.display = 'none'; // Hide the preview if no file is selected
    }
}
// JQUERY/AJAX FUNCTIONS
/* 
$(document).ready(function(){
    // make modular for both vote options
    function upvotePost(postId, button){
        console.log('Upvoting post:', postId);
        $.ajax({
            url: `/post/upvote/${postId}`,
            method: 'POST',
            success: function(result) {
                if (result.success) {
                    const upvoteCount = $(button).find('.upvote-count');
                    if (upvoteCount.length) {
                        upvoteCount.text(result.upvotes);
                        console.log('Upvote count updated:', result.upvotes);
                    } else {
                        console.error('Upvote count element not found');
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('Failed to upvote post:', error);
            }
        });
    }

    // Attach event listener to upvote buttons
    $('.upvote-btn').click(function(){
        const postId = $(this).attr('postId');
        console.log('Button clicked, postId:', postId);
        upvotePost(postId, this);
    });
});
*/

$(document).ready(function(){
    function upvote(postId, button){
        console.log('====== UPVOTE AJAX SCRIPT====');
        console.log('PostId:', postId);
        $.ajax({
            url: `/post/upvote/${postId}`,
            method: 'POST',
            success: function(res){
                if(res.success) {
                    const upvoteCount = $(button).find('.upvote-count');
                    const downvoteCount = $(button).siblings('.downvote-btn').find('.downvote-count');
                    upvoteCount.text(res.upvotes);
                    downvoteCount.text(res.downvotes);
                }
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401) { // status sent from route handler
                    // User is not logged in, redirect to login page
                    window.location.href = '/login';
                } else {
                    console.error('Failed to upvote post:', error);
                }
            }
        })
    }

    function downvote(postId, button){
        $.ajax({
            url: `/post/downvote/${postId}`,
            method: 'POST',
            success: function(res){
                if(res.success) {
                    const downvoteCount = $(button).find('.downvote-count');
                    const upvoteCount = $(button).siblings('.upvote-btn').find('.upvote-count');
                    downvoteCount.text(res.downvotes);
                    upvoteCount.text(res.upvotes);
                }
            },
            error: function(xhr, status, error) {
                if (xhr.status === 401) { // status sent from route handler
                    // User is not logged in, redirect to login page
                    window.location.href = '/login';
                } else {
                    console.error('Failed to upvote post:', error);
                }
            }
        })
    }

    // TWEAK LISTENERS, active state disappears on reload
    // Listener for upvote
    $(document).on('click', '.upvote-btn', function () {
        const postId = $(this).attr('postId');
        console.log('Upvote, postId in script.js:', postId);
        // Testing
        if (!postId) {
            console.error('Post ID is missing');
            return;
        }
        upvote(postId, this);

        // Toggle the active class on the upvote button
        $(this).toggleClass('vote-active');
        // Remove the active class from the sibling downvote button
        $(this).siblings('.downvote-btn').removeClass('vote-active');
    });

    // Listener for downvote
    $(document).on('click', '.downvote-btn', function () {
        const postId = $(this).attr('postId');
        console.log('Downvote, postId in script.js:', postId);
        downvote(postId, this);

        // Toggle the active class on the downvote button
        $(this).toggleClass('vote-active');
        // Remove the active class from the sibling upvote button
        $(this).siblings('.upvote-btn').removeClass('vote-active');
    });

    //** NOTES
    // Added event delegation in listeners for dynamically added elements, ensure listener is attached
    // The click event is attached to the $(document) or another parent element that always exists
    // */

    // Infinite scroll
    let currentPage = 1;
    let isLoading = false;
    const loadMoreMarker = $('#load-more-marker');

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading) {
                loadMorePosts();
            }
        });
    });

    // Start observing the marker
    if (loadMoreMarker.length) {
        observer.observe(loadMoreMarker[0]);
    }

    function loadMorePosts() {
        if (isLoading) return;
        isLoading = true;
        currentPage++;

        // Get current path to determine if we're on home or popular
        const path = window.location.pathname;
        const endpoint = path === '/popular' ? '/popular' : '/';

        $.ajax({
            url: `${endpoint}?page=${currentPage}`,
            method: 'GET',
            success: function(response) {
                if (response.trim()) {
                    // Insert new posts before the marker
                    loadMoreMarker.before(response);
                    isLoading = false;
                } else {
                    // No more posts to load
                    loadMoreMarker.remove();
                    observer.disconnect();
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading more posts:', error);
                isLoading = false;
            }
        });
    }
});
