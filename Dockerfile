FROM node:20.17.0 AS build

# 设置npm镜像源为阿里云
RUN npm config set registry https://registry.npmmirror.com

# 安装yarn并设置镜像源为阿里云
RUN npm install -g yarn --force && yarn config set registry https://registry.npmmirror.com

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean --force

COPY . . 

RUN npm run build

#FROM docker.mirrors.sjtug.sjtu.edu.cn/library/nginx:latest
FROM nginx:latest

# Copy the built Vue.js files from the 'build' stage to the Nginx web server directory
COPY --from=build ./dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]
