FROM node:18-alpine

# Munkakönyvtár beállítása
WORKDIR /app

# Package fájlok másolása
COPY package*.json ./

# Függőségek telepítése
RUN npm ci --only=production

# Alkalmazás kódjának másolása
COPY . .

# Port megnyitása
EXPOSE 3001

# Alkalmazás indítása
CMD ["npm", "start"]