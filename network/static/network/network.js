document.addEventListener('DOMContentLoaded', () =>
{
    document.querySelectorAll('#show-posts').forEach(element =>
    {
        element.addEventListener('click', (event) =>
        {
            event.preventDefault();
            main_page();
        });
    });
    try
    {
        document.querySelector("#following").addEventListener('click', (event) =>
        {
            event.preventDefault();
            following_page();
        });
    } catch (error)
    {
        console.log(error);
    }
    main_page();
})

function main_page()
{
    document.querySelector('#main-page').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    all_posts();
    compose();
}

function compose()
{
    if (document.querySelector('#compose-post') != null)
    {
        document.querySelector('#post-content').value = '';
        document.querySelector('#compose-form').onsubmit = () =>
        {
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

function all_posts(page_num)
{
    document.querySelector('#title').textContent = 'All Posts';
    document.querySelector('#all-posts').innerHTML = ``;
    fetch(`/all-posts/${page_num}`).then(r => r.json()).then(posts =>
    {
        let ctr = 0;
        posts.forEach(post =>
        {
            console.log(post);
            const element = document.createElement('div');
            console.log(post['likes'].length)
            if (post['likes'].length > 0)
            {
                element.innerHTML = `<div class="post">
                                  <a id="show-profile${ctr}" href="#">${post['user']}</a>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>
                                  <p>${post['likes'].length}</p>
                                  </div>`;
            } else
            {
                element.innerHTML = `<div class="post">
                                  <a id="show-profile${ctr}" href="#">${post['user']}</a>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>
                                  </div>`;
            }
            console.log(element);
            const id = "#show-profile" + ctr++;
            console.log(id);
            document.querySelector('#all-posts').append(element);
            document.querySelector(id).addEventListener('click', () =>
            {
                profile_page(post['user']);
            })
        });

    }).catch(error => console.log(error));
}

function profile_page(username)
{
    document.querySelector('#user-posts').innerHTML = ``;
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';
    fetch(`/profile/${username}`).then(response => response.json()).then(user =>
    {
        const profile = document.querySelector('#profile');
        profile.innerHTML = `<h1>${user['username']}</h1>`;
        fetch(`follow/${username}`).then(r => r.json()).then(result =>
        {
            let change;
            profile.innerHTML += `<button id="follow">follow</button>`;
            document.querySelector('#follow').addEventListener('click', () =>
            {
                const element = document.querySelector('#followers-count');
                const followers_count = parseInt(element.textContent.split(' ')[1], 10);
                element.textContent = `Followers: ${followers_count + change}`;
                change = -change;
                if (document.querySelector('#follow').textContent === 'unfollow')
                {
                    document.querySelector('#follow').textContent = 'follow';
                } else
                {
                    document.querySelector('#follow').textContent = 'unfollow';
                }
                fetch(`follow/${username}`, {
                    method: 'POST'
                }).catch(error => console.log(error));
            })
            if (result['type'] === 1)
            {
                document.querySelector('#follow').style.display = 'block';
                document.querySelector('#follow').textContent = 'unfollow';
                change = -1;
            } else if (result['type'] === 2)
            {
                document.querySelector('#follow').style.display = 'block';
                document.querySelector('#follow').textContent = 'follow';
                change = 1;
            } else
            {
                document.querySelector('#follow').style.display = 'none';
            }
        });

        profile.innerHTML += `<p id="followers-count">Followers: ${user['followers'].length}</p>
                            <p id="following-count">Following: ${user['following'].length}</p>`;
        console.log(user['posts']);
        user['posts'].forEach(post =>
        {
            console.log(post);
            const element = document.createElement('div');
            console.log(post['likes'].length)
            if (post['likes'].length > 0)
            {
                element.innerHTML = `<div class="post">
                                  <h5${post['user']}</h5>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>
                                  <p>${post['likes'].length}</p>
                                  </div>`;
            } else
            {
                element.innerHTML = `<div class="post">
                                  <h5 ${post['user']}</h5>
                                  <p>${post['content']}</p>
                                  <p>${post['timestamp']}</p>
                                  </div>`;
            }
            document.querySelector('#user-posts').append(element)
        })
    });
}

function following_page()
{
    document.querySelector('#main-page').style.display = 'block';
    document.querySelector('#profile-page').style.display = 'none';
    followed_posts();
    compose();
}

function followed_posts()
{
    document.querySelector('#title').textContent = 'Followed Posts';
    document.querySelector('#all-posts').innerHTML = ``;
    fetch('/followed-posts').then(r => r.json())
        .then(posts =>
        {
            console.log(posts);
            let ctr = 0;
            posts.forEach(post =>
            {
                console.log(post);
                const element = document.createElement('div');
                console.log(post['likes'].length)
                if (post['likes'].length > 0)
                {
                    element.innerHTML = `<div class="post">
                                      <a id="show-profile${ctr}" href="#">${post['user']}</a>
                                      <p>${post['content']}</p>
                                      <p>${post['timestamp']}</p>
                                      <p>${post['likes'].length}</p>
                                      </div>`;
                } else
                {
                    element.innerHTML = `<div class="post">
                                      <a id="show-profile${ctr}" href="#">${post['user']}</a>
                                      <p>${post['content']}</p>
                                      <p>${post['timestamp']}</p>
                                      </div>`;
                }
                console.log(element);
                const id = "#show-profile" + ctr++;
                console.log(id);
                document.querySelector('#all-posts').append(element);
                document.querySelector(id).addEventListener('click', () =>
                {
                    profile_page(post['user']);
                })
            });
        })
        .catch(error => console.log('Fetch error: ', error));
}