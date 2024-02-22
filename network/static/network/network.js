document.addEventListener('DOMContentLoaded', ()=>
{
    compose();
    all_posts();
})
function compose()
{
    document.querySelector('#compose-form').onsubmit = () =>
    {
        const content= document.querySelector('#post-content').value;
        fetch('/compose', {
            method: 'POST',
            body: JSON.stringify({
                content: content
            })
        }).then(r => r.json()).then(result =>console.log(result)).catch(error => console.log(error));
        return false;
    }
}
function all_posts()
{
    fetch('/all-posts').then(r => r.json()).then(posts=>
    {
        posts.forEach(element => {
            console.log(element)
            const post = document.createElement('div');
            post.innerHTML = `<h6>${element.author}</h6><p>${element.content}</p><p>${element.timestamp}</p>`;
            document.querySelector('#all-posts').append(post);
        });
    }).catch(error => console.log(error));
}