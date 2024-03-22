from django.contrib.auth.models import AbstractUser
from django.core.paginator import Paginator
from django.db import models
from django.db.models import CASCADE


class User(AbstractUser):
    pass

    def serialize(self, page_num):
        posts = self.posts.all().order_by("-timestamp").all()
        p = Paginator(posts, 10)
        page = p.page(page_num)
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "followers": [
                x.follower.username for x in Following.objects.filter(following=self)
            ],
            "following": [
                x.following.username for x in Following.objects.filter(follower=self)
            ],
            "page": {
                "has_next": page.has_next(),
                "has_previous": page.has_previous(),
                "posts": [post.serialize() for post in page.object_list],
            },
        }


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField(max_length=256)
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": [user.username for user in self.likes.all()],
        }


class Following(models.Model):
    follower = models.ForeignKey(User, on_delete=CASCADE, related_name="following")
    following = models.ForeignKey(User, on_delete=CASCADE, related_name="follower")
