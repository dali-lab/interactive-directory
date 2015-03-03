# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20150220_1658'),
    ]

    operations = [
        migrations.RenameField(
            model_name='individual',
            old_name='idle_media',
            new_name='neutral_media',
        ),
        migrations.RenameField(
            model_name='individual',
            old_name='main_media',
            new_name='unique_media',
        ),
    ]
