
# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Installiere next.js global
RUN npm install -g next

# Kopiere package.json
COPY package.json ./

# Installiere Abhängigkeiten mit legacy peer deps
RUN npm install --legacy-peer-deps

# Kopiere den restlichen Quellcode
COPY . .

# Setze Berechtigungen für den Build-Prozess
RUN chmod +x node_modules/.bin/next

# Build der Anwendung
RUN npm run build

# Production Stage
FROM node:18-alpine AS runner

WORKDIR /app

# Installiere next.js global im Production-Stage
RUN npm install -g next

# Kopiere package.json und package-lock.json
COPY --from=builder /app/package*.json ./

# Installiere nur Produktionsabhängigkeiten
RUN npm install --production --legacy-peer-deps

# Kopiere Build-Artefakte und public Ordner
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Kopiere Next.js Konfigurationsdatei
COPY --from=builder /app/next.config.mjs ./

# Setze Umgebungsvariablen
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Exponiere Port 3000
EXPOSE 3000

# Starte die Anwendung
CMD ["npm", "start"]
