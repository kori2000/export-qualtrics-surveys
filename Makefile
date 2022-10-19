build:
	docker-compose build
up:
	docker-compose up -d
	sleep 3
	docker logs app-cnt
down:
	docker-compose down