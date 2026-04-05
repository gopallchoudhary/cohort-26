docker run -d --name sql_class_pg -e POSTGRES_PASSWORD=postgres -p 5433:5432 postgres:15

docker exec -it sql_class_pg psql -U postgres
