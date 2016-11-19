FROM node:argon

# Update
RUN apt-get update

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Clone repository
RUN  git clone https://github.com/NelsonMaty/ActivosInformaticos.git .


# Install npm pependencies
RUN npm install
RUN npm install -g bower

# Install bower dependencies
RUN bower install --allow-root

RUN mv node_modules/angular-formly/dist bower_components/angular-formly/dist

# Start application
RUN npm install -g grunt
EXPOSE 9000
CMD [ "grunt", "serve" ]
