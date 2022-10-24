# Base Image
FROM node:slim

# 실행퀀한 Root
USER root

# 파일을 WORKDIR(/) 로 복사한다
# WORKDIR /
# COPY

# Nest.js project 를 install 한다
RUN yarn install --immutable --immutable-cache --check-cache

# Api Application 실행
CMD ["yarn", "start:dev"]