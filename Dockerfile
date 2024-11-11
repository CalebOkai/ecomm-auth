FROM node:22.9.0

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn install --frozen-lockfile

# Copy production files
COPY ./src /app/src
COPY ./prisma /app/prisma
COPY ./tsconfig.json /app

RUN yarn prisma generate

CMD ["sh", "-c", "if [ \"$NODE_ENV\" != \"local\" ]; then yarn prisma migrate deploy; fi && yarn start"]