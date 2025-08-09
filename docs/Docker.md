Postgres -> docker run --name postgresdb -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

Redis -> docker run -d --name redis -p 6379:6379 redis

Kafka -> docker run -d --name kafka -p 9092:9092 apache/kafka:latest
