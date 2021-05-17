#! /bin/bash
# used by docker-compose to create the required collections for the app
# mongoexport --db=jobsite --collection=users --jsonArray --pretty --out=users.json
echo 'Importing mongo seed'
mongoimport --host localhost --db jobsite --collection jobs --type json --file /create-mongo-seed/jobs.json --jsonArray
mongoimport --host localhost --db jobsite --collection announcements --type json --file /create-mongo-seed/announcements.json --jsonArray
mongoimport --host localhost --db jobsite --collection sources --type json --file /create-mongo-seed/sources.json --jsonArray
mongoimport --host localhost --db jobsite --collection users --type json --file /create-mongo-seed/users.json --jsonArray