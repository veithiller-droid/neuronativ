# Dockerfile for Railway deployment with Puppeteer support
# Liegt in: neuronativ/backend/Dockerfile

FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Kopiert den ganzen Repo-Root (neuronativ/) nach /app
# Frontend liegt dann in /app/test/, /app/index.html etc.
COPY . .

# Wechselt ins Backend
WORKDIR /app/backend

# Dependencies installieren
RUN npm install --production

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 8080

CMD ["node", "server.js"]