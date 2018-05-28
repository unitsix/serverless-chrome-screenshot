FROM lambci/lambda:build-nodejs6.10
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo && yum update && yum -y install yarn 

RUN npm install -g serverless

ENV SERVERLESS serverless@1.26.1
RUN yarn global add $SERVERLESS
WORKDIR /opt/app