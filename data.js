/* FIELDS:
    - userProfile: URL to the user's profile image.
    - username: The username of the user.
    - community: The community to which the post belongs.
    - postTitle: The title of the post.
    - postImg: URL to the image associated with the post.
    - downvotes: Number of downvotes the post has received.
    - upvotes: Number of upvotes the post has received.
    - comments: Number of comments in the post
*/

function getPosts(){
	const fs = require('fs');
	let rawdata = fs.readFileSync('./posts.json');
	return JSON.parse(rawdata);
}

module.exports.getPosts = getPosts;
