document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#show-posts').forEach(element => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            main_page();
        });
    });
    try {
        document.querySelector("#following").addEventListener('click', (event) => {
            event.preventDefault();
            following_page();
        });
    } catch (error) {
        console.log(error);
    }
    main_page();
})

function editing(event) {
    let post = event.target.closest(".post");
    const post_content = post.querySelector(".post_content");
    const post_content_container = post.querySelector(".post_content_container");
    const new_post_content = document.createElement('textarea');
    new_post_content.innerHTML = post_content.innerHTML;
    post_content.append()
}

function display_post(post, current_user, context_id) {
    console.log(post);
    const element = document.createElement('div');
    console.log(post['likes'].length);
    element.classList.add('post');
    element.innerHTML = `<a href="#">${post['user']}</a>
                                  <div class="post_content_container">
                                    <p class="post_content">${post['content']}</p>
                                  </div>
                                  <p>${post['timestamp']}</p>`;
    if (current_user === post['user']) {
        element.innerHTML += `<button id="edit">Edit</button>`;
    }
    if (post['likes'].length > 0) {
        element.innerHTML += `<p>${post['likes'].length}</p>`;
    }
    console.log(element);
    document.querySelector(context_id).append(element);
    element.addEventListener('click', (event) => {
        if (event.target.nodeName === "A") profile_page(post['user'], 1);
        if (event.target.nodeName === "BUTTON") {
            editing(event);
        }
    })
}

function pagination(func, user, page, context_id, page_num) {
    const ul = document.createElement('ul');
    ul.classList.add('pagination');
    document.querySelector(context_id).append(ul);
    console.log(document.querySelector(context_id));
    if (page['has_previous']) {
        const previous = document.createElement('li');
        previous.classList.add('page-item');
        previous.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        previous.addEventListener('click', () => {
            if (func.length === 1) func(page_num - 1); else if (func.length === 2) func(user, page_num - 1);
        })
        ul.appendChild(previous);
    }
    if (page['has_next']) {
        const next = document.createElement('li');
        next.classList.add('page-item');
        next.innerHTML = `<a class="page-link" href="#">Next</a>`;
        next.addEventListener('click', () => {
            if (func.length === 1) func(page_num + 1); else if (func.length === 2) func(user, page_num + 1);
        })
        ul.appendChild(next);
    }
}

function main_page() {
    document.querySelector('#main-page').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    all_posts(1);
    compose();
}

function compose() {
    if (document.querySelector('#compose-post') != null) {
        document.querySelector('#post-content').value = '';
        document.querySelector('#compose-form').onsubmit = () => {
            const content = document.querySelector('#post-content').value;
            fetch('/compose', {
                method: 'POST', body: JSON.stringify({
                    content: content
                })
            }).then(r => r.json()).then(result => console.log(result)).catch(error => console.log(error));
            location.reload();
            return false;
        }
    }
}

function all_posts(page_num) {
    document.querySelector('#title').textContent = 'All Posts';
    document.querySelector('#all-posts').innerHTML = ``;
    document.querySelector('#paginate').innerHTML = ``;
    fetch(`/all-posts/${page_num}`).then(r => r.json()).then(result => {
        result.page['posts'].forEach(post => {
            display_post(post, result['current_user'], '#all-posts')
        });
        pagination(all_posts, result['current_user'], result.page, '#paginate', page_num);
    }).catch(error => console.log(error));
}

function profile_page(username, page_num) {
    document.querySelector('#user-posts').innerHTML = ``;
    document.querySelector('#user_paginate').innerHTML = ``;
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';
    fetch(`/profile/${username}/${page_num}`).then(response => response.json()).then(result => {
        const profile = document.querySelector('#profile');
        profile.innerHTML = `<h1>${result.user['username']}</h1>`;
        fetch(`follow/${username}`).then(r => r.json()).then(result => {
            let change;
            profile.innerHTML += `<button id="follow">follow</button>`;
            document.querySelector('#follow').addEventListener('click', () => {
                const element = document.querySelector('#followers-count');
                const followers_count = parseInt(element.textContent.split(' ')[1], 10);
                element.textContent = `Followers: ${followers_count + change}`;
                change = -change;
                if (document.querySelector('#follow').textContent === 'unfollow') {
                    document.querySelector('#follow').textContent = 'follow';
                } else {
                    document.querySelector('#follow').textContent = 'unfollow';
                }
                fetch(`follow/${username}`, {
                    method: 'POST'
                }).catch(error => console.log(error));
            })
            if (result['type'] === 1) {
                document.querySelector('#follow').style.display = 'block';
                document.querySelector('#follow').textContent = 'unfollow';
                change = -1;
            } else if (result['type'] === 2) {
                document.querySelector('#follow').style.display = 'block';
                document.querySelector('#follow').textContent = 'follow';
                change = 1;
            } else {
                document.querySelector('#follow').style.display = 'none';
            }
        });
        profile.innerHTML += `<p id="followers-count">Followers: ${result.user['followers'].length}</p>
                            <p id="following-count">Following: ${result.user['following'].length}</p>`;
        console.log(result.user.page['posts']);
        result.user.page['posts'].forEach(post => {
            display_post(post, result['current_user'], '#user-posts');
        })
        pagination(profile_page, username, result.user.page, '#user_paginate', page_num);
    });
}

function following_page() {
    document.querySelector('#main-page').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    followed_posts(1);
    compose();
}

function followed_posts(page_num) {
    document.querySelector('#title').textContent = 'Followed Posts';
    document.querySelector('#all-posts').innerHTML = ``;
    document.querySelector('#paginate').innerHTML = ``;
    fetch(`/followed-posts/${page_num}`).then(r => r.json())
        .then(result => {
            console.log(result.page['posts']);
            let ctr = 0;
            result.page['posts'].forEach(post => {
                display_post(post, result['current_user'], '#all-posts');
            });
            pagination(followed_posts, result['current_user'], result.page, '#paginate', page_num);
        })
        .catch(error => console.log('Fetch error: ', error));
}