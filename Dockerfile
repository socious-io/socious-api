###################
# BUILD FOR DEVELOPMENT/TESTING
# (to get an image run `docker build -t socious-api-dev --target development .`)
###################

FROM node:lts AS development

# Add Tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

# Configure app
ENV DB_HOST socious_mysql

EXPOSE 8370

###################
# BUILD FOR PRODUCTION
###################

FROM node:lts AS build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Run the build command which creates the production bundle
RUN npm run build

USER node

###################
# BUILD PACKAGES FOR PRODUCTION
###################

FROM node:lts AS modules

WORKDIR /usr/src/app

COPY package*.json ./

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production

###################
# PRODUCTION
###################

FROM node:lts AS production

# Add Tini
COPY --from=development /tini /
ENTRYPOINT ["/tini", "--"]

USER node

WORKDIR /usr/src/app

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=modules /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node ormconfig.ts .
COPY --chown=node:node migrations ./migrations

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Configure app
ENV DB_HOST socious_mysql
ENV DB_PORT 3306

EXPOSE 8370

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
