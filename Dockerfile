FROM node:22 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build

#######################################
# Stage 2: Production Stage
#######################################
FROM node:22

# Create the group for further user
RUN addgroup app

# Create the user and add him to the group
RUN adduser --system --ingroup app app

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY google-credentials.json ./

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile --production

EXPOSE 3000

USER app:app

CMD ["yarn", "run", "start"]