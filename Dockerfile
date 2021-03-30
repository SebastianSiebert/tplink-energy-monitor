# ---- Base Image ----
FROM node:alpine AS base
WORKDIR /opt/tplink-monitor

COPY tplink-energy-monitor/package.json .
COPY tplink-energy-monitor/package-lock.json .

# ---- Build Image ----
FROM base AS src

# fix missing python for node-sass
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

#RUN npm install typescript -g
#RUN npm install --quiet node-gyp -g

RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production --force
RUN mv node_modules prod_node_modules

RUN npm install --quiet --force

COPY tplink-energy-monitor/ .

#RUN ls -la ./apps/client/src

RUN npm run build-all -- --with-deps

# ---- Release ----
FROM base as release

COPY --from=src /opt/tplink-monitor/prod_node_modules ./node_modules
COPY --from=src /opt/tplink-monitor/dist/api-server/ .
COPY --from=src /opt/tplink-monitor/dist/client .

EXPOSE 3000
CMD ["npm", "start"]
