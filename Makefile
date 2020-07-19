include .env


start-nodemon:
	docker-compose -f Docker-compose-dev.yaml build backend-app
	docker-compose run -e NODE_ENV=development --service-ports --entrypoint=npm backend-app run nodemon
	# docker-compose -f Docker-compose-dev.yaml up --entrypoint=npm backend-app run nodemon

start-nodemon-dockerfile:
	docker build -f Dockerfile.dev -t node_server_nodemon . 
	docker run -p $(PORT):$(PORT) node_server_nodemon npm run nodemon

start:
	docker-compose -f Docker-compose-dev.yaml build
	docker-compose -f Docker-compose-dev.yaml run -e NODE_ENV=development --service-ports --entrypoint=npm backend-app run start
	# docker-compose -f Docker-compose-dev.yaml up

start-dockerfile:
	docker build -f Dockerfile.dev -t tech390/server-node . 
	docker run -p $(PORT):$(PORT) --name $(conatiner_name) tech390/server-node 

build:
	docker rm -f $(conatiner_name)
	docker build -f Dockerfile.dev -t tech390/server-node . 
	docker run -p $(PORT):$(PORT) --name $(conatiner_name) tech390/server-node 
	docker cp $(conatiner_name):/usr/app/dist .

start-prod:
	docker build -t tech390/server-node . 
	docker run -p $(PORT):$(PORT) tech390/server-node npm run startproduction