import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Following


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "network/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "network/register.html", {"message": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request, "network/register.html", {"message": "Username already taken."}
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required
@csrf_exempt
def compose(request):
    if request.method == "POST":
        content = json.loads(request.body).get("content", "")
        user = request.user
        post = Post(user=user, content=content)
        post.save()
        return JsonResponse({"message": "Post created successfully."}, status=201)
    else:
        return JsonResponse({"error": "POST request required."}, status=400)


def paginate(request, posts, page_num, per_page):
    p = Paginator(posts, per_page)
    page = p.page(page_num)
    return JsonResponse(
        {
            "current_user": request.user.username,
            "page": {
                "has_next": page.has_next(),
                "has_previous": page.has_previous(),
                "posts": [post.serialize() for post in page.object_list],
            },
        },
        safe=False,
    )


def all_posts(request, page_num):
    posts = Post.objects.all().order_by("-timestamp").all()
    paginate(request, posts, page_num, 10)


def profile(request, username, page_num):
    user = User.objects.get(username=username)
    return JsonResponse(
        {"current_user": request.user.username, "user": user.serialize(page_num)}
    )


@login_required
@csrf_exempt
def follow(request, username):
    user1 = request.user
    user2 = User.objects.get(username=username)
    user2_followers = [x.follower for x in Following.objects.filter(following=user2)]
    if request.method == "POST":
        if user1 in user2_followers:
            Following.objects.get(follower=user1, following=user2).delete()
            return JsonResponse({"message": "unfollowed successfully"})
        else:
            Follow = Following(follower=user1, following=user2)
            Follow.save()
            return JsonResponse({"message": "followed successfully"})
    else:
        if user1 == user2 or not user1.is_authenticated:
            return JsonResponse(
                {
                    "type": 0,
                    "message": "Unable to follow this user",
                }
            )
        elif user1 in user2_followers:
            return JsonResponse(
                {
                    "type": 1,
                    "message": "You can unfollow this user",
                }
            )
        else:
            return JsonResponse(
                {
                    "type": 2,
                    "message": "You can follow this user",
                }
            )


def followed_posts(request, page_num):
    user_following = Following.objects.filter(follower=request.user).values("following")
    Followed_posts = (
        Post.objects.filter(user__in=user_following).order_by("-timestamp").all()
    )
    paginate(request, Followed_posts, page_num, 10)
