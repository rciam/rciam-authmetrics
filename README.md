# rciam metrics
RCIAM METRICS service

## Install

### Build the Python/Nodejs image
docker-compose build

### Pull the database
docker-compose pull

### Install python dependencies
docker-compose run --rm --no-deps web pip install --upgrade pip
docker-compose run --rm --no-deps web pip install -r requirements.txt

### Install nodejs dependencies
docker-compose run --rm --no-deps api npm install

### Run Database deployment
[//]: # (docker-compose run --rm web alembic revision --autogenerate -m 'Initial Migration')
docker-compose run --rm web alembic upgrade head

### Seed with test data

[//]: # (docker-compose run --rm web python app/seed.py)

### Start the Service
docker-compose up api