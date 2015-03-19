from django.contrib import admin
from app.models import Individual, ExtraField, StaffGroup, Building, Map


class IndividualAdmin(admin.ModelAdmin):
    ordering = ['last_name']

admin.site.register(Individual, IndividualAdmin)
admin.site.register(ExtraField)
admin.site.register(StaffGroup)
admin.site.register(Building)
admin.site.register(Map)
