from django.shortcuts import render
from django.views.decorators.http import require_safe
from django.http import HttpResponse, HttpResponseNotFound
from app.models import Building, StaffGroup, Individual, ExtraField, Map
import json


def JSONResponse(dictionary):
    return HttpResponse(json.dumps(dictionary, indent=2),
                        content_type="application/json")


@require_safe
def retrieve_view(request):
    return render(request, "index.html", {
        'building': {
            'name': Building.objects.get_building().name
        },
        'groups': [{
            'group_id': g.id,
            'name': g.name,
            'priority': g.priority
        } for g in StaffGroup.objects.all()],
        'maps': [{
            'floor_number': mapObject.floor,
            'image': mapObject.map_img
        } for mapObject in Map.objects.all()]
    })


@require_safe
def retrieve_screensaver(request):
    return render(request, "screensaver.html", {
        'building': {
            'name': Building.objects.get_building().name,
            'description': Building.objects.get_building().description,
        },
    })


@require_safe
def get_building(request):
    return JSONResponse({
        'name': Building.objects.get_building().name,
        'description': Building.objects.get_building().description,
        'location': Building.objects.get_building().location
    })


@require_safe
def get_groups(request):
    """
    Returns all of the groups
    """
    return JSONResponse({
        'groups': [{
            'group_id': g.id,
            'name': g.name,
            'priority': g.priority
        } for g in StaffGroup.objects.all()],
    })


@require_safe
def get_individuals_in_group(request, group_id):
    """
    Returns the individuals in a group
    """

    try:
        group = StaffGroup.objects.get(id=group_id)
    except StaffGroup.DoesNotExist:
        return HttpResponseNotFound

    return JSONResponse({
        'group': {
            'name': group.name
        },
        'people': [
            # TODO: sort in alphabetical order
            p.json_data() for p in Individual.objects.filter(group=group)
        ]
    })


@require_safe
def get_people(request):
    """
    """
    return JSONResponse({
        # TODO: sort in alphabetical order
        'group': {
            'name': "All"
        },
        'people': [
            p.json_data() for p in Individual.objects.all()
        ]
    })


@require_safe
def get_person(request, person_id):
    """
    """
    try:
        person = Individual.objects.get(id=person_id)
    except Individual.DoesNotExist:
        return HttpResponseNotFound

    return JSONResponse(person.json_data())


# @require_safe
# def get_maps(request):
#     """
#     """
#     return JSONResponse({
#         'maps': [{
#             'floor_number': map.floor,
#             'image': map.map_img
#         } for map in Map.objects.all()]
#     })
