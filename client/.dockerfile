FROM node:alpine as build

WORKDIR '/client'

COPY ./package.json .

RUN npm install --production

COPY . .

ARG REACT_APP_SERVER
ENV REACT_APP_SERVER $REACT_APP_SERVER

RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /client/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000