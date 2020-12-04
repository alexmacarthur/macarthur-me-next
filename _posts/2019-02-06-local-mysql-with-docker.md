---
title: Quickly Spin Up MySQL w/ Docker Compose
ogImage: https://images.pexels.com/photos/15798/night-computer-hdd-hard-drive.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260
---

I've often needed to quickly spin up a local instance of MySQL. [Docker Compose](https://docs.docker.com/compose/) this makes it stupid easy. Rather than running a long, convoluted `docker` command, I can configure an image just the way I want it while maintaining the ability to turn it easily turn it on and off as needed.

## Getting Set Up

Inside a new directory, create a `data` directory and `docker-compose.yml` file.

```
new-directory
├── data
└── docker-compose.yml
```

Paste the following into your `docker-compose.yml` file:

```
version: '3'

services:
  db:
    container_name: docker-local-mysql
    image: mysql:5.7.21
    volumes:
      - "./data:/var/lib/mysql"
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: root

```

## Managing a Container

To start the container, run `docker-compose up`. To stop & remove the container, run `docker-compose down`. For more information on the plethora of commands avaible to leverage your container, [see here](https://docs.docker.com/compose/reference/).

## Persisting Data

Whenever MySQL modifies any data within the container, it will persist locally inside your `./data` directory, even after you stop and restart everything. This is configured by the `volumes:` property in your `docker-compose.yml` file.

## Running Commands Inside Container

To run any Bash commands inside the running container, use `docker-compose exec db bash`.

## Connecting w/ SequelPro or Similar Tool

Use the following values to connect to the running container.

**Host:** 127.0.0.1

**Username:** root

**Password:** root

**Port:** 3306

## Looking to Set Up Other DBs w/ Docker Compose?

I've put this Compose setup and a few others [into a repository](https://github.com/alexmacarthur/local-docker-db) for easy access. At the time I'm writing this, it includes MySQL, Postgres, and Mongo. Feel free to use it as needed, as well as contrbute any other configurations you've found useful.

## The End.

Boom. With a single command, you have a running, persistent, self-contained MySQL instance ready for your development needs. Have a helpful tip related to anything here? Share it!
