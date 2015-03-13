# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_individual_office_map'),
    ]

    operations = [
        migrations.RenameField(
            model_name='individual',
            old_name='office_map',
            new_name='office_floor',
        ),
    ]
