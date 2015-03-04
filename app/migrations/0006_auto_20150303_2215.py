# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20150303_2140'),
    ]

    operations = [
        migrations.CreateModel(
            name='Map',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('floor', models.IntegerField()),
                ('map_img', models.URLField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='individual',
            name='neutral_media',
            field=models.URLField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='individual',
            name='pointing_media',
            field=models.URLField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='individual',
            name='unique_media',
            field=models.URLField(),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='individual',
            name='waving_media',
            field=models.URLField(),
            preserve_default=True,
        ),
    ]
