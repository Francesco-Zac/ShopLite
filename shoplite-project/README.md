# ShopLite Project

ShopLite e un progetto e-commerce composto da:

- frontend Angular 21
- backend Node.js + Express
- database MySQL

Il frontend gira di default su `http://localhost:4200`, mentre il backend espone le API su `http://localhost:3000/api`.

## Struttura del progetto

```text
shoplite-project/
|-- src/                     # Frontend Angular
|   |-- app/
|   |   |-- components/      # Componenti UI riutilizzabili
|   |   |-- directives/      # Direttive custom
|   |   |-- guards/          # Protezione rotte
|   |   |-- models/          # Modelli TypeScript
|   |   |-- pages/           # Pagine principali dell'app
|   |   `-- services/        # Chiamate API e logica condivisa
|   `-- environments/        # Configurazione ambiente frontend
|-- backend/                 # Server Express e accesso al database
|   |-- controllers/         # Logica delle API
|   |-- middleware/          # Middleware Express
|   |-- routes/              # Definizione endpoint
|   |-- db.js                # Connessione MySQL e inizializzazione DB
|   |-- index.js             # Avvio del backend
|   `-- .env.example         # Esempio configurazione backend
|-- public/                  # Asset statici
|-- dist/                    # Build di produzione
`-- package.json             # Script e dipendenze del progetto
```

## Prerequisiti

Prima di avviare il progetto assicurati di avere installato:

- Node.js
- npm
- MySQL Server
- Angular 21

## Installazione dopo il download

1. Apri un terminale nella cartella del progetto.
2. Installa le dipendenze:

```bash
npm install
```


## Avvio corretto del progetto

Per far funzionare correttamente l'applicazione devono essere attivi:

- MySQL
- backend Express
- frontend Angular

### 1. Avvia MySQL

Verifica che il server MySQL sia in esecuzione

### 2. Avvia il backend

In un primo terminale esegui:

```bash
cd backend
node index.js
```

Se tutto è configurato correttamente, il server sarà disponibile su:

```text
http://localhost:3000
```

Endpoint di verifica:

```text
http://localhost:3000/api/health
```

### 3. Avvia il frontend

In un secondo terminale esegui:

```bash
ng serve
```

Poi apri il browser su:

```text
http://localhost:4200
```

Nota: il frontend usa come API base URL `http://localhost:3000/api`, quindi il backend deve essere avviato prima o insieme al frontend.

## Script disponibili

```bash
npm start
npm run start:frontend
npm run start:backend
npm run build
npm run test
```
