from django.db import models


class Individual(models.Model):

    """
    """
    group = models.ForeignKey('StaffGroup')

    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    phone_number = models.IntegerField()
    email = models.EmailField()
    office = models.CharField(max_length=100)

    main_media = models.CharField(max_length=200)
    idle_media = models.CharField(max_length=200)
    waving_media = models.CharField(max_length=200)
    pointing_media = models.CharField(max_length=200)

    def json_data(self):
        return {
            'person_id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'email': self.email,
            'office': self.office,
            'main_media': self.main_media,
            'idle_media': self.idle_media,
            'waving_media': self.waving_media,
            'pointing_media': self.pointing_media,

            'extra_fields': [{
                extra.field: extra.value
            } for extra in ExtraField.objects.filter(individual=self)]
        }

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)


class ExtraField(models.Model):

    """
    """
    individual = models.ForeignKey('Individual')
    field = models.CharField(max_length=100)
    value = models.CharField(max_length=500)

    def __str__(self):
        return "{} for {}".format(self.field, self.individual)


class StaffGroup(models.Model):

    """
    """
    name = models.CharField(max_length=64)
    priority = models.IntegerField()

    def __str__(self):
        return self.name


class Building(models.Model):

    """
    """

    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

    # TODO: make custom shared_store manager

# TODO: floor class containing the map
