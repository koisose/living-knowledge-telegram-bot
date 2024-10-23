FROM node:22-alpine 
WORKDIR /app
ENV LIVINGKNOWLEDGE_BOT=
ENV BRAVESEARCH_API=
ENV NEXT_TELEMETRY_DISABLED=
COPY package.json ./
RUN apk add git
RUN npm install 
RUN apk del git
COPY . .


# for deploting the build version
EXPOSE 3000
RUN npm run build
# and
CMD npm run serve

