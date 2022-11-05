/*!
 * mongo-seed-faker
 *
 * A tool with FAKER.js power to quickly populate your mongo db from a object or .json file.
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var faker = require('faker');

var fakerIdentifier = '@faker';
var objectIdIdentifier = 'ObjectId';
var isoDateIdentifier = 'ISODate';
var newDateIdentifier = 'new Date';
var fakerOriginalIdentifier = 'faker'; 

Promise.each = async function(arr, fn) {
  for(const item of arr) await fn(item);
}

/* Parse faker js methods and evaluate them
 *
 * @param {String} str string to parse
 */
function parseFakerJs(str){
  console.log(str.replace(fakerIdentifier, fakerOriginalIdentifier));
  return eval(str.replace(fakerIdentifier, fakerOriginalIdentifier))
}

/* Parse mongoDb Id
 *
 * @param {String} str string to parse
 */
function parseObjectId(str){
  return  eval(str)
}

/* Parse ISO date
 *
 * @param {String} str string to parse
 */
function parseIsoDate(str){
  return eval(str.replace(isoDateIdentifier, newDateIdentifier))
}


/* Checks if parse is needed and then parse
 *
 * @param {String} str string to parse
 * @returns  {String} parsed string
 */
function parse(str){
  if(str.includes(fakerIdentifier)){
    return parseFakerJs(str);
  }
  if(str.includes(objectIdIdentifier)){
    return parseObjectId(str)
  }
  if(str.includes(isoDateIdentifier)){
    return parseIsoDate(str)
  }
  return str;
}

/* Parse template object faker.js keywords and multiply them number of times
 *
 * @param {OBJECT} template structure of documents
 * @param {Number} howMany numbers of documents to returns
 * @returns {Array<object>} Parsed documents
 */
function parseTemplateJson(template , howMany){
  var parsedArray = [];
  for(var i = 0; i < howMany; i++) {
    parsedArray[i] = {};
    for(key in template){
        parsedArray[i][key] = typeof template[key] === "string" ? parse(template[key]) : template[key];
    }; 
  }
  return parsedArray
}


/* Parse data for faker.js keywords 
 *
 * @param {Array<object>} template structure of documents
 * @returns {Array<object>} Parsed documents
 */
function parseJson(json){
  return json.map(o=>{
    for(key in o){
      o[key] = typeof o[key] === "string" ? parse(o[key]) : o[key];
    }
    return o;
  });
}


/* Initialize mongo-seed-faker and populate seed data
 *
 * @param {Array<object>} jsonData Seed data 
 * @param {String} dbUri mongo uri
 * @param {String} dbName database name
 * @param {Object} dbOptions Extra db options
 * @returns {undefined}  
 */
async function initialize (jsonData, dbUri, dbName, dbOptions = {}) { 
  const dbClient = await MongoClient.connect(dbUri, dbOptions);
  const db = dbClient.db(dbName); 

  await Promise.each(jsonData, async function(item){
      data = [];
      if(item.seedOnlyIfEmpty|| 
        (!item.seedOnlyIfEmpty && await db.collection(item.collectionName).countDocuments() === 0)){
        if(item.data && item.data.length > 0){
          parsedArray = parseJson( item.data);
          Array.prototype.push.apply(data,parsedArray);
        }
        if(item.template && item.template){
          parsedTemplateArray = parseTemplateJson(item.template, item.howMany);
          Array.prototype.push.apply(data,parsedTemplateArray);
        } 

        console.log(data.length)
        if(data.length > 0){
          await db.collection(item.collectionName).insertMany(data);
        }
      }
    });

    dbClient.close();
}

module.exports = initialize
