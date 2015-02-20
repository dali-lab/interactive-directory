# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_building_location'),
    ]

    operations = [
        migrations.AlterField(
            model_name='building',
            name='location',
            field=models.CharField(default='Hanover,NH', max_length=64),
            preserve_default=False,
        ),
    ]
