# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_auto_20150313_1617'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='individual',
            name='group',
        ),
        migrations.AddField(
            model_name='individual',
            name='groups',
            field=models.ManyToManyField(to='app.StaffGroup'),
            preserve_default=True,
        ),
    ]
