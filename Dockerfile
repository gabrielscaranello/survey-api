###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:24-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN corepack enable && \
  yarn install --immutable

###################
# BUILD FOR PRODUCTION
###################
FROM node:24-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app .

RUN yarn build

###################
# FINAL PRODUCTION IMAGE
###################
FROM node:24-alpine As production

WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/yarn.lock ./yarn.lock

RUN echo 'nodeLinker: node-modules' > .yarnrc.yml && \
  corepack enable && \
  yarn workspaces focus --all --production && \
  yarn cache clean --all

CMD [ "yarn", "start" ]
