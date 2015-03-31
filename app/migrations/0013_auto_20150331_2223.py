# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_auto_20150319_0425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='individual',
            name='office_floor',
            field=models.ForeignKey(blank=True, to='app.Map', null=True),
            preserve_default=True,
        ),
    ]
