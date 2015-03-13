# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='individual',
            name='office_map',
            field=models.ForeignKey(default=1, to='app.Map'),
            preserve_default=False,
        ),
    ]
