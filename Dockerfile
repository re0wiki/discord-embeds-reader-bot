FROM browserless/chrome
USER root

RUN npm i -g snap-tweet typescript ts-node

WORKDIR /app
COPY . .
RUN npm i

CMD ["ts-node", "src/index.ts"]
