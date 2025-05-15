# Étape 1 : Utiliser une image Node officielle
FROM node:18

# Étape 2 : Créer et définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le projet dans l'image
COPY . .

# Étape 6 : Exposer le port utilisé par l’app
EXPOSE 5000

# Étape 7 : Lancer l'application
CMD [ "npm","start", "app.js" ]
