from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("compose", views.compose, name="compose"),
    path("all-posts/<int:page_num>", views.all_posts, name="all-posts"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("follow/<str:username>", views.follow, name="follow"),
    path("followed-posts", views.followed_posts, name="followed-posts"),
]
