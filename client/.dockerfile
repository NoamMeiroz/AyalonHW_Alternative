FROM node:alpine as build

WORKDIR '/client'

COPY ./package.json .

RUN npm install --production

COPY . .

RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /client/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/404.html /usr/share/nginx/html
COPY ./nginx/n_masikim.jpg /usr/share/nginx/html
EXPOSE 3000