
# Uso

Per far partire il progetto:
```bash
docker compose up --build
```

Aprire il broswer e mettere il seguente url: `http://localhost:5173/`

# Note

## Frontend

Per la grafica sono stati usati i componenti UI di Shadcn e Tailwind.

## Backend

Le tabelle nel DB vengono create con delle migrations, sempre dal 
backend.

All'avvio dell'applicazione oltre a creare le tabelle, vengono anche popolate con dei dati casuali.

Come ORM è stato usato Sequelize.

Si gestisce ricerca, sorting e paginazione nel backend.

## Database

Per il database è stato usato l'utente postgres, perchè in questo caso d'uso la sicurezza non è la priorità.

