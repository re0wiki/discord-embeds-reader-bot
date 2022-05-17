FROM browserless/chrome

RUN npm i -g snap-tweet typescript ts-node

USER root
WORKDIR /app
COPY . .
RUN npm i

CMD ["ts-node", "src/index.ts"]
