#  Dockerfile for Node scraper
FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-2.30-r0.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.30-r0/glibc-bin-2.30-r0.apk && \
    apk add glibc-2.30-r0.apk && \
    apk add glibc-bin-2.30-r0.apk && \
    apk add firefox-esr && \
    wget https://github.com/mozilla/geckodriver/releases/download/v0.26.0/geckodriver-v0.26.0-linux64.tar.gz && \
    tar -zxf geckodriver-v0.26.0-linux64.tar.gz -C /usr/bin && \
    geckodriver --version

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .