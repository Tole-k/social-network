# Generated by Django 5.0.2 on 2024-02-23 20:33

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("network", "0004_alter_post_likes"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="followers",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                related_name="followed_by",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="post",
            name="content",
            field=models.TextField(max_length=256),
        ),
        migrations.AlterField(
            model_name="post",
            name="likes",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                related_name="liked_posts",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
