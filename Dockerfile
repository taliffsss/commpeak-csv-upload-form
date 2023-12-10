# Use multi-stage build to reduce final image size

# Stage 1: Build
FROM node:lts-alpine3.18 as build

# Set environment variables
ENV HOME=/usr/src/app
ENV PATH $HOME/node_modules/.bin:$PATH

# Create app directory
RUN mkdir -p $HOME
WORKDIR $HOME

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json $HOME/
RUN npm install --production

# Copy app source code
COPY . $HOME

# Generate build
RUN npm run build

# Stage 2: Run
FROM nginx:stable

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
