from django.contrib import admin

from network.models import User, Post, Following

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Following)
