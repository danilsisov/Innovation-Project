## MONGO-SEED-FAKER

A tool to easily populate mongodb database with power of [faker.js](https://www.npmjs.com/package/faker) 


# Installation

```js
npm i mongo-seed-faker
```


## Usage


```js
const mongoSeedFaker =  require("mongo-seed-faker");

const mongoUri = 'mongodb://localhost:27017/test';
const dbName = 'test';
const seedData = [{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	// if want to populate same structure of data multiple times
	template: { name: '@faker.name.findName()', email: 'Some static value' },
	// how many times to populate data specified by 'template' 
	howMany: 10,
	
	// We can also pass mulitple documents and all document structure can be differs
	data:[{name: '@faker.name.findName()', email: 'Some static value' },
	{name: '@faker.name.findName()', email: 'random different email' },]
}];

// or if you want to use json file replace seedData parameter with seedDataFromFile in mongoSeedFaker function below
const seedDataFromFile = JSON.parse(require('./seedData.json'));

mongoSeedFaker(seedData, dbUri, dbName);
```

## Function mongoSeedFaker params
|             Param   |Data type                          |Description                         |
|----------------|-------------------------------|-----------------------------|
|seedData|`Array<object> `            | Seed data           |
|dbUri          |`String`            |Mongo connection uri  |
dbName | `String`| Database name |
databaseOption| Object| mongodb connect function options ([availble options](https://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/))

## Seed Data Object Keys



|             Key   |Data type                          |Description                         |
|----------------|-------------------------------|-----------------------------|
|collectionName|`STRING e.g. 'users'`            | Name of mongodb's collection             |
|seedOnlyIfEmpty          |`BOOLEAN e.g. true`            |Should populate if collection have some data already?            |
|template          |`OBJECT e.g. { name: 'Test'}`|Structure to follow when populating database|
|howMany|`NUMBER e.g. 10` | How many documents to make with template stucture 
| data |`ARRAY OF OBJECTS e.g. [{name: 'Test'}]`| Array of documents that needs to be populated



## How to use faker.js inside seedData

We can use faker.js in both 'template' and 'data' in seedData object like this:-
`name: '@faker.name.firstName()'`

Just add '@' on front of faker.js function and make it string.  
e.g. faker.name.firstName() should be '@faker.name.firstName()' so that it parses properly.

 [click here to see availble faker.js methods](https://www.npmjs.com/package/faker)

## How to populate mongodb objectId and ISODate
We can also populate mongodb objectId and ISODate through seedData object. Just pass them as string. e.g.
`_id: "ObjectId('5c86135dff97166fd7e28b46')",
createdAt: "ISODate('2019-03-11T07:49:37.640Z')"`


## Some seed data examples:
```js
// multiple users data with some field from fakerjs
seedData = [{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	data:[{name: 'John', email: 'email@yahoo.com' },
	      {name: '@faker.name.findName()', email: 'email@gmail.com' },]
}];
	
// Populate 10 users with a static role and dynamic fakerjs's names
const seedData = [{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	template: { name: '@faker.name.findName()', email: 'email@gmail.com', role:'user' },
	howMany: 10,
}];

// Both template and data at same time
seedData = [{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	data:[{name: 'John', email: 'email@gmzil.com' },
		  {name: 'Rock', email: 'email@gmail.com' },],
	template: { name: '@faker.name.findName()', email: 'email@gmail.com', role:'user' },
	howMany: 10,
}];


// Seeding for multiple collections
seedData = [{
	collectionName: 'authors',
	seedOnlyIfEmpty: true,
	data:[{name: 'Albert', email: 'abert@gmzil.com' },
		  {name: 'Ram', email: 'ram@gmail.com' },],
	template: { name: '@faker.name.findName()', email: 'email@gmail.com', role:'user' },
	howMany: 10,
},{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	data:[{name: 'John', email: 'email@gmzil.com' },
		  {name: 'Rock', email: 'email@gmail.com' },],
	template: { name: '@faker.name.findName()', email: 'email@gmail.com', role:'user' },
	howMany: 10,
}];


// Passing  ObjectId and ISODate
seedData = [{
	collectionName: 'users',
	seedOnlyIfEmpty: true,
	data:[{_id: "ObjectId('5c86135dff97166fd7e28b46')", name: 'John', createdAt: "ISODate('2019-03-11T07:49:37.640Z')"},
	      {name: '@faker.name.findName()', email: 'email@gmail.com' },]
}];

```

## License
mongo-faker-seed is distributed under MIT license.

### That's it

> **Note:** Developement is in progress and there are still more features to come :).
