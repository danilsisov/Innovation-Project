/// Install faker js using: 
/// npm install @faker-js/faker --save-dev


import { faker } from '@faker-js/faker';
import { faker as faker_zh_CN } from '@faker-js/faker/locale/zh_CN';

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

/*export const USERS: User[] = [];

export function lulz(): User {
  return {
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}
*/

let users_list: String[] = [];

Array.from({ length: 10 }).forEach(() => {
  //Array contains n number of unique user id values, this must be done to ensure that orders from users repeat
  users_list.push(faker.datatype.uuid());
});


function dist (x1,y1,x2,y2){
    return Math.sqrt(Math.pow( x1-x2, 2) + Math.pow( y1-y2, 2))
}

class User {}

function createRandomUser(): User {
  return {
    storage_id: faker.helpers.arrayElement(['Storage A', 'Storage B']),
    price: faker.finance.amount(),
    Item_ID: faker.internet.password(),
    Item_name: faker.commerce.product(),
    User_address: faker.address.nearbyGPSCoordinate(
      [60.250690, 24.902729], 
      5,
      true
    ), // 20 km area from the center of Helsinki (most likely need to change city as Helsinki is close to water)
    Client_ID: users_list[Math.floor(Math.random() * users_list.length)], //maybe limit options??? Otherwise all users will be unique
    time: faker.date.between(
      '2020-08-01T00:00:00.000Z',
      '2023-03-01T00:00:00.000Z'
    ),
    status: faker.helpers.arrayElement(['On the way', 'Delivered']),
    // can also add names of users, zipcode, email, properties of package (size,weight...), also can add avatar picture
    // need to think of time it took to deliver
  };
}


let user_values: User[] = []; // array of objects to store data
const user = createRandomUser(); //single user (was used for testing)

Array.from({ length: 10 }).forEach(() => {
  //change length parameter to define the data size, most likely we will have around 70 deliveries per day, we have 943 days -> 66 010 data samples
  user_values.push(createRandomUser());
});


let delivery_time = dist(60.250690, 24.902729, user_values[0].User_address[0], user_values[0].User_address[1])/30;



/// values can be reached with user_values[<number in array>].<class parameter>
/// Example of outputing value through HTML: ${user_values[1].price}

///Array.from({ length: 10 }).forEach(() => {
///  USERS.push(createRandomUser());
///});

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
    <p>
    List of users: ${users_list}
    <p>
    User: ${user_values[0].Client_ID}
    <p>
    user coords: ${user_values[0].User_address}
    <p>
    dist: ${dist(60.250690, 24.902729, user_values[0].User_address[0], user_values[0].User_address[1])}
    <p>
    dist2: ${delivery_time}
  </div>  
</div>
`;
