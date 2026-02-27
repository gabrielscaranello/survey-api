include .env
include .env.test

up:
	docker compose up -d

down:
	docker compose down

install: down
	docker compose up -d --build --remove-orphans --force-recreate

build:
	docker build -t survey-api --target production .
