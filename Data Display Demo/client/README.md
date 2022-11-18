# Hackathon - client (web-part)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

## Setup

1. Make sure that [node](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/) are installed. To test installation, run: `yarn --version`
1. Clone this repo: `git clone https://github.com/danilsisov/Innovation-Project.git`
1. Navigate to `Data Display Demo / client` folder: `cd Data Display Demo/client`
1. Install dependencies: `yarn`
1. Start app: `npm start`

This app will then be running on http://localhost:3000

## Technologies:
Here is a list of technologies that we used:

Mapbox GL JS 2

React-map-gl


### Data generator:

In order to simulate delivery processes, our projects requires massive amount of data. For this reason a data generator was developed. It is written in TypeScript and the main library used is Faker.js. Delivery is represented as a class, for each single delivery a class object gets created with all necessary information including Delivery satus, storage id, customer id, customers co-ordinates, item id and date&time of the delivery. 