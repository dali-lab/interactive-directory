from django.conf.urls import patterns, include, url
from django.contrib import admin
from app import controller

urlpatterns = patterns(
    '',
    url(r'^$', controller.retrieve_view, name='view'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/building/$', controller.get_building, name='building'),
    url(r'^api/group/$', controller.get_groups, name='groups'),
    url(r'^api/group/(?P<group_id>[^/]+)/$',
        controller.get_individuals_in_group, name='get_individuals_in_group'),
    url(r'^api/person/$', controller.get_people, name="people"),
    url(r'^api/person/(?P<person_id>[^/]+)/$',
        controller.get_person, name="person"),
    url(r'^api/search/(?P<search_query>[^/]+)/$',
        controller.get_individuals_by_search,
        name="search")
)
