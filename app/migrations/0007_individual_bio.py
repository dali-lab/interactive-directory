# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20150303_2200'),
    ]

    operations = [
        migrations.AddField(
            model_name='individual',
            name='bio',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
