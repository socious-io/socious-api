###################
# BUILD FOR DEVELOPMENT/TESTING
###################

FROM node:20 AS development

# Add Tini for arm64
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-arm64 /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm ci
RUN npm rebuild

# Bundle app source
COPY --chown=node:node . .
COPY --chown=node:node docker.env .env

# Use the node user from the image (instead of the root user)
USER node

EXPOSE 5061

CMD [ "node", "serve.js" ]

###################
# BUILD PACKAGES FOR PRODUCTION
###################

FROM node:20 AS modules

WORKDIR /usr/src/app

COPY package*.json ./

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Install production dependencies
RUN npm ci --omit=dev
RUN npm rebuild

###################
# PRODUCTION
###################

FROM node:20 AS production

# Copy Tini from development stage
COPY --from=development /tini /tini
ENTRYPOINT ["/tini", "--"]

USER node

WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=modules /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/src ./src
COPY --chown=node:node --from=development /usr/src/app/serve.js .
COPY --chown=node:node --from=development /usr/src/app/templates ./templates
COPY --chown=node:node --from=development /usr/src/app/docs ./docs
COPY --chown=node:node --from=development /usr/src/app/scripts ./scripts
COPY --chown=node:node --from=development /usr/src/app/package.json .
COPY --chown=node:node --from=development /usr/src/app/migrations ./migrations
COPY --chown=node:node --from=development /usr/src/app/.env .

# Set NODE_ENV environment variable
ENV NODE_ENV production

EXPOSE 5061

# Start the server using the production build
CMD [ "node", "serve.js" ]
