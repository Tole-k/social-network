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
        let ctr = 0;
        result.page['posts'].forEach(post => {
            console.log(post);
            const element = document.createElement('div');
            console.log(post['likes'].length);
            element.classList.add('post');
            element.innerHTML = `<a id="show-profile${ctr}" href="#">${post['user']}</a>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>`;
            if (result['current_user'] === post['user']) {
                element.innerHTML += `<button id="edit">Edit</button>`;
            }
            if (post['likes'].length > 0) {
                element.innerHTML += `<p>${post['likes'].length}</p>`;
            }
            console.log(element);
            const id = "#show-profile" + ctr++;
            console.log(id);
            document.querySelector('#all-posts').append(element);
            document.querySelector(id).addEventListener('click', () => {
                profile_page(post['user'], 1);
            })
        });
        const ul = document.createElement('ul');
        ul.classList.add('pagination');
        document.querySelector('#paginate').append(ul);
        console.log(document.querySelector('#paginate'));
        if (result.page['has_previous']) {
            const previous = document.createElement('li');
            previous.classList.add('page-item');
            previous.innerHTML = `<a class="page-link" href="#">Previous</a>`;
            previous.addEventListener('click', () => {
                all_posts(page_num - 1);
            })
            ul.appendChild(previous);
        }
        if (result.page['has_next']) {
            const next = document.createElement('li');
            next.classList.add('page-item');
            next.innerHTML = `<a class="page-link" href="#">Next</a>`;
            next.addEventListener('click', () => {
                all_posts(page_num + 1);
            })
            ul.appendChild(next);
        }

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
            console.log(post);
            const element = document.createElement('div');
            console.log(post['likes'].length);
            element.classList.add('post');
            element.innerHTML = `<div class="post">
                                  <h5${post['user']}</h5>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>`;
            if (result['current_user'] === post['user']) {
                element.innerHTML += `<button id="edit">Edit</button>`;
            }
            if (post['likes'].length > 0) {
                element.innerHTML += `<p>${post['likes'].length}</p>`;
            }
            document.querySelector('#user-posts').append(element)
        })
        const ul = document.createElement('ul');
        ul.classList.add('pagination');
        document.querySelector('#user_paginate').append(ul);
        console.log(document.querySelector('#user_paginate'));
        if (user.page['has_previous']) {
            const previous = document.createElement('li');
            previous.classList.add('page-item');
            previous.innerHTML = `<a class="page-link" href="#">Previous</a>`;
            previous.addEventListener('click', () => {
                profile_page(username, page_num - 1);
            })
            ul.appendChild(previous);
        }
        if (user.page['has_next']) {
            const next = document.createElement('li');
            next.classList.add('page-item');
            next.innerHTML = `<a class="page-link" href="#">Next</a>`;
            next.addEventListener('click', () => {
                profile_page(username, page_num + 1);
            })
            ul.appendChild(next);
        }
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
                console.log(post);
                const element = document.createElement('div');
                console.log(post['likes'].length);
                element.classList.add('post');
                element.innerHTML = `<div class="post">
                                      <a id="show-profile${ctr}" href="#">${post['user']}</a>
                                      <p>${post['content']}</p>
                                      <p>${post['timestamp']}</p>`;
                if (post['likes'].length > 0) {
                    element.innerHTML += `<p>${post['likes'].length}</p>`;
                }
                console.log(element);
                const id = "#show-profile" + ctr++;
                console.log(id);
                document.querySelector('#all-posts').append(element);
                document.querySelector(id).addEventListener('click', () => {
                    profile_page(post['user'], 1);
                })
            });
            const ul = document.createElement('ul');
            ul.classList.add('pagination');
            document.querySelector('#paginate').append(ul);
            console.log(document.querySelector('#paginate'));
            if (result.page['has_previous']) {
                const previous = document.createElement('li');
                previous.classList.add('page-item');
                previous.innerHTML = `<a class="page-link" href="#">Previous</a>`;
                previous.addEventListener('click', () => {
                    followed_posts(page_num - 1);
                })
                ul.appendChild(previous);
            }
            if (result.page['has_next']) {
                const next = document.createElement('li');
                next.classList.add('page-item');
                next.innerHTML = `<a class="page-link" href="#">Next</a>`;
                next.addEventListener('click', () => {
                    followed_posts(page_num + 1);
                })
                ul.appendChild(next);
            }
        })
        .catch(error => console.log('Fetch error: ', error));
}