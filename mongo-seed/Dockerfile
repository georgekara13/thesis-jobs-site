FROM mongo:4.4

ARG USERNAME
ENV USERNAME=${USERNAME}
ARG PASSWORD
ENV PASSWORD=${PASSWORD}
COPY jobs.json /jobs.json
COPY sources.json /sources.json
COPY users.json /users.json
COPY roles.json /roles.json
COPY announcements.json /announcements.json
CMD ["sh", "-c", "mongoimport --host mongodb --authenticationDatabase admin --username ${USERNAME} --password ${PASSWORD} --db jobsite --collection jobs --type json --file /jobs.json --jsonArray; mongoimport --host mongodb --authenticationDatabase admin --username ${USERNAME} --password ${PASSWORD} --db jobsite --collection sources --type json --file /sources.json --jsonArray; mongoimport --host mongodb --authenticationDatabase admin --username ${USERNAME} --password ${PASSWORD} --db jobsite --collection users --type json --file /users.json --jsonArray; mongoimport --host mongodb --authenticationDatabase admin --username ${USERNAME} --password ${PASSWORD} --db jobsite --collection announcements --type json --file /announcements.json --jsonArray; mongoimport --host mongodb --authenticationDatabase admin --username ${USERNAME} --password ${PASSWORD} --db jobsite --collection roles --type json --file /roles.json --jsonArray"]
