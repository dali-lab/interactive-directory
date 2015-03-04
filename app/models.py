from django.db import models


class Individual(models.Model):

    """
    """
    group = models.ForeignKey('StaffGroup')

    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    office = models.CharField(max_length=100)
    bio = models.TextField(null=True, blank=True)

    unique_media = models.URLField(max_length=200)
    neutral_media = models.URLField(max_length=200)
    waving_media = models.URLField(max_length=200)
    pointing_media = models.URLField(max_length=200)

    def json_data(self):
        return {
            'person_id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone_number': self.phone_number,
            'email': self.email,
            'office': self.office,
            'bio': self.bio,
            'unique_media': self.unique_media,
            'neutral_media': self.neutral_media,
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


class BuildingManager(models.Manager):

    """
    """

    def get_building(self):
        try:
            return self.order_by('id')[0]
        except IndexError:
            return Building(
                name="Create a building in /admin",
                location="Specify location in Building model in /admin"
            )


class Building(models.Model):
    objects = BuildingManager()
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=64, null=True, blank=True)
    location = models.CharField(max_length=64)

    def __str__(self):
        return self.name


class Map(models.Model):
    floor = models.IntegerField()
    map_img = models.URLField()

    def __str__(self):
        return "Floor {}".format(self.floor)
