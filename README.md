# Tech Radar

## Documentation
- [Project description](/docs/project_description.md)
- [Arc42 documentation](/docs/project_documentation.md)
- [Work journal](docs/work_journal.pdf)
- [Final thoughts](docs/final_thoughts.md)

## How to start the application
Um das Projekt zu starten, muss [Docker](https://www.docker.com/) installiert sein.

### Docker Compose
Für das Starten der Applikation besteht eine [docker-compose.yml](docker-compose.yml)
Datei und zwei Docker files:
- [Dockerfile](project/ui/Dockerfile)
- [Dockerfile](project/api/Dockerfile)

Die [docker-compose.yml](docker-compose.yml) Datei zieht sich Informationen aus einem .env file,
welches vor dem Start manuell, im selben Ordner, erstellt werden muss.
Die .env Datei sollte volgende Informatioenn enthalten:
```
JWT_SECRET=[choose your Secret]

MONGO_INITDB_ROOT_USERNAME=[choose your DB username]
MONGO_INITDB_ROOT_PASSWORD=[choose your DB password]
MONGO_DB_NAME=[choose your DB name]

BACKEND_MONGO_URI=mongodb://[fill with DB username]:[fill with DB password]@mongodb:27017/[fill with DB name]?authSource=admin
```

Führe diesen Befehl zum Starten aus:
```bash
docker compose up --build -d
```

## Users
Da kein Benutzermanagement vorhanden ist werden folgende Benutzer beim start erzeugt:

| EMail                 | Password      | Role      	|
|-----------------------|---------------|-----------	|
| admin@admin.ch       	| 1234       	| CTO       	|
| employee@employee.ch 	| 4321      	| Employee      |



