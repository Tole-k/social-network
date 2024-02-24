document.addEventListener('DOMContentLoaded', () =>
{
    document.querySelectorAll('.show-posts').forEach(element =>
    {
        element.addEventListener('click', () =>
        {
            main_page();
        });
    });
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
    document.querySelector('#post-content').value = '';
    document.querySelector('#compose-form').onsubmit = () =>
    {
        const content = document.querySelector('#post-content').value;
        fetch('/compose', {
            method: 'POST',
            body: JSON.stringify({
                content: content
            })
        }).then(r => r.json()).then(result => console.log(result)).catch(error => console.log(error));
        location.reload();
        return false;
    }
}

function all_posts()
{
    fetch('/all-posts').then(r => r.json()).then(posts =>
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
    document.querySelector('#main-page').style.display = 'none';
    document.querySelector('#profile-page').style.display = 'block';
    fetch(`/profile/${username}`).then(response => response.json()).then(user =>
    {
        const profile = document.createElement('div');
        fetch(`follow/${username}`).then(r => r.json()).then(result =>
        {
            if (!result['type'])
            {
                profile.innerHTML = `<h1>${user['username']}</h1>
                             <p>Followers: ${user['followers'].length}</p>
                             <p>Following: ${user['following'].length}</p>
                             <div id="user-posts"></div>`;
            } else if (result['type'] === 1)
            {
                profile.innerHTML = `<h1>${user['username']}</h1>
                             <button id="unfollow">Unfollow</button>
                             <p>Followers: ${user['followers'].length}</p>
                             <p>Following: ${user['following'].length}</p>
                             <div id="user-posts"></div>`;
            } else
            {
                profile.innerHTML = `<h1>${user['username']}</h1>
                             <button id="follow">follow</button>
                             <p>Followers: ${user['followers'].length}</p>
                             <p>Following: ${user['following'].length}</p>
                             <div id="user-posts"></div>`;
            }
        })
        document.querySelector('#profile-page').append(profile);
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