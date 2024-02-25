from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import CASCADE


class User(AbstractUser):
    pass

    def serialize(self):
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
            "posts": [
                post.serialize()
                for post in self.posts.all().order_by("-timestamp").all()
            ],
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
