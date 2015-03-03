# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20150303_2140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='individual',
            name='phone_number',
            field=models.CharField(max_length=20),
            preserve_default=True,
        ),
    ]
