# Deploy system in the docker

## Pull source code for each service

API Service

```bash
git clone https://github.com/reallongnguyen/base-api-service.git && mv base-api-service api-service
```

## Preparation environment variable `.env`

You should see the README of each service

- [API Service](https://github.com/reallongnguyen/base-api-service/blob/main/README.md)

## Execute docker

```bash
docker compose up -d
```
