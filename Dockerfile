
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli

RUN npm install

COPY . .

RUN rm -rf dist/

ARG ENVIRONMENT

RUN ng build --configuration=$ENVIRONMENT

FROM nginx:alpine

# COPY --from=build /usr/src/app/dist/figma_frontend/browser /usr/share/nginx/html
 COPY --from=build /usr/src/app/dist/bus_app_frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
