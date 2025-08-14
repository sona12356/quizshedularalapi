FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install || yarn install || pnpm install
COPY . .
RUN npm run build || yarn build || pnpm build
EXPOSE 4000
CMD ["npm", "start"]
