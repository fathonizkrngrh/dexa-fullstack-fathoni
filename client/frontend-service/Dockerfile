# Stage 1: Build Next.js
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Jalankan aplikasi
FROM node:18

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "run", "start"]
