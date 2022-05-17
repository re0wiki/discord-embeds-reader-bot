FROM browserless/chrome

USER root
WORKDIR /app
COPY . .
RUN npm i -g snap-tweet typescript ts-node
RUN npm i

CMD ["ts-node", "src/index.ts"]
