#  Dockerfile for Node scraper
FROM ubuntu:16.04 as firefox-stage
# Create App Directory
WORKDIR /usr/local/src

RUN apt-get update && apt-get install -y firefox

FROM node:10.16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=firefox-stage /usr/local/src  .

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .