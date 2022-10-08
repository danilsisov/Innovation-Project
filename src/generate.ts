/// Install faker js using: 
/// npm install @faker-js/faker --save-dev


import { faker } from '@faker-js/faker';

/* used for testing single outputs
const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const avatarUrl = faker.image.avatar();
const natureImageUrl = faker.image.nature();
const zh_CN_fullName = `${faker_zh_CN.name.firstName()} ${faker_zh_CN.name.lastName()}`;
const lul = faker.internet.password();
const kek = faker.datatype.uuid();
const deliv = faker.commerce.product();
const price = faker.finance.amount();
const x = faker.datatype.number();
const y = faker.datatype.number();
const addr = faker.address.nearbyGPSCoordinate();
const addr2 = faker.address.nearbyGPSCoordinate(
  [60.192059, 24.945831],
  20,
  true
);
const zip = faker.address.zipCode();
const statezip = faker.address.zipCodeByState('AK');
const storage = faker.helpers.arrayElement(['a', 'b']);
const status = faker.helpers.arrayElement(['On the way', 'Delivered']);
const time = faker.date.between(
  '2020-08-01T00:00:00.000Z',
  '2023-03-01T00:00:00.000Z'
);
*/

class User {} /// create class for the data

function createRandomUser(): User { ///generate data for each delivery
  return {
    storage_id: faker.helpers.arrayElement(['Storage A', 'Storage B']), ///selects values only from array, atm we plan to have only one storage, but added two just in case
    price: faker.finance.amount(), ///price for delivery
    Client_ID: faker.datatype.uuid(), ///unique user id...maybe limit options??? Otherwise all users will be unique
    Item_ID: faker.internet.password(), ///unique id of a devilvery-item, used another style of id generation
    Item_name: faker.commerce.product(), ///name of the product (not necessary) example: T-shirt, wallet...
    User_address: faker.address.nearbyGPSCoordinate(
      [60.192059, 24.945831],
      20,
      true
    ), // 20 km area from the center of Helsinki (most likely need to change city as Helsinki is close to water)
    time: faker.date.between(
      '2020-08-01T00:00:00.000Z',
      '2023-03-01T00:00:00.000Z'
    ), ///random day/time between the dates (943 days in total). 2 years of past data and a few month ahead from today
    status: faker.helpers.arrayElement(['On the way', 'Delivered']),
    // can also add names of users, zipcode, email, properties of package (size,weight...), also can add avatar picture
    // need to think of time it took to deliver
  };
}

let user_values: User[] = []; // array of objects to store data
const user = createRandomUser(); //single user (was used for testing)

///data generation:
Array.from({ length: 10 }).forEach(() => {
  //change length parameter to define the data size, most likely we will have around 70 deliveries per day, we have 943 days -> 66 010 data samples
  user_values.push(createRandomUser());
});

/// values can be reached with user_values[<number in array>].<class parameter>
/// Example of outputing value through HTML: ${user_values[1].price}





///The following code was used to test generated data through HTML page




const appDiv: HTMLElement = document.querySelector('#app');
appDiv.innerHTML = `
<h1>Faker Demo</h1>
<div class="card">
  <div class="card__image">
    <img src="${natureImageUrl}" alt="Background image for ${fullName}"/>
  </div>
  <div class="card__profile">
    <img src="${avatarUrl}" alt="Avatar image of ${fullName}"/>
  </div>
  <div class="card__body">
    ${fullName} - <b>zh_CN Name:</b> ${zh_CN_fullName}
    LuL: ${lul}
    Kek: ${kek}
    Item: ${deliv}
    Price: ${price}
    X: ${x}
    Y: ${y}
    address: ${addr}
    specified address ${addr2}
    State zip: ${statezip}
    Storage id: ${storage}
    User: ${user_values[1].price}
    User: ${user_values[2].price}
    User: ${user_values[3].price}
    Time: ${time}
  </div>  
</div>
`;
