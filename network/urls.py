from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("compose", views.compose, name="compose"),
    path("all-posts/<int:page_num>", views.all_posts, name="all-posts"),
    path("profile/<str:username>/<int:page_num>", views.profile, name="profile"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("followed-posts/<int:page_num>", views.followed_posts, name="followed-posts"),
    path("edit/<int:post_id>", views.edit, name="edit"),
    path("like/<int:post_id>/<int:unlike_mode>", views.like, name="like"),
]
