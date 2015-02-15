# interactive-directory

Project by the <a href="http://dali.dartmouth.edu">Digital Arts Leaderships and Innovation (DALI) Lab</a> at Dartmouth College.

Built on Django, Angular.js, Coffeescript, and Bootstrap.

## Set-up
Run all commands from root directory of project.

##### Install Django
> pip install django

##### Download dependencies
> cd app/static; npm install; cd ..;

##### Compile coffeescript
> coffee --watch -c app/static/

Remove ```--watch``` if you just want to compile once.

##### Run app
> python manage.py runserver
