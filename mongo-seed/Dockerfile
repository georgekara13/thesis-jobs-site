FROM mongo

COPY jobs.json /jobs.json
COPY sources.json /sources.json
COPY users.json /users.json
COPY announcements.json /announcements.json
CMD ["sh", "-c", "mongoimport --host mongodb --db jobsite --collection jobs --type json --file /jobs.json --jsonArray; mongoimport --host mongodb --db jobsite --collection sources --type json --file /sources.json --jsonArray; mongoimport --host mongodb --db jobsite --collection users --type json --file /users.json --jsonArray; mongoimport --host mongodb --db jobsite --collection announcements --type json --file /announcements.json --jsonArray"]
