DOCKER_COMPOSE?=docker-compose
EXEC?=$(DOCKER_COMPOSE) exec $(TTY) truffle
NODE?=node
GANACHE?=/app/ganache-core.docker.cli.js
TRUFFLE?=$(EXEC) truffle
NPM?=$(EXEC) npm

.PHONY: build

build:
	$(DOCKER_COMPOSE) pull --parallel --ignore-pull-failures
	$(DOCKER_COMPOSE) build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g) --pull --force-rm

up:
	$(DOCKER_COMPOSE) up -d --remove-orphans

install: build up node_modules

stop:
	$(DOCKER_COMPOSE) kill -s SIGINT
	$(DOCKER_COMPOSE) rm -v --force

restart: stop up

reset: stop install

install: up
	$(DOCKER_COMPOSE) up -d

.PHONY: ganache truffle-init truffle-migrate truffle-test

sh:
	$(EXEC) sh

node_modules:
	$(NPM) install truffle
	$(NPM) install --save-dev solidity-coverage

ganache:
	$(GANACHE)

truffle-init: truffle-config.js

truffle-config.js:
	touch truffle-config.js
	$(TRUFFLE) init

truffle-migrate:
	$(TRUFFLE) migrate

truffle-migrate-reset:
	$(TRUFFLE) migrate --reset

truffle-test:
	$(TRUFFLE) test

truffle-coverage:
	$(TRUFFLE) run coverage