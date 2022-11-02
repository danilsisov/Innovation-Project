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


let users_list: String[] = [];

Array.from({ length: 10 }).forEach(() => {
  //Array contains n number of unique user id values, this must be done to ensure that orders from users repeat
  users_list.push(faker.datatype.uuid());
});


///function to calculate distance in km between two coordinate points on the map

function distance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		return dist * 1.609344; ///return in km
	}
}

class User {}

function createRandomUser(): User {
  let x1 = faker.address.nearbyGPSCoordinate(
    [60.250690, 24.902729], 
    5,
    true
  )[0];
  let y1 = faker.address.nearbyGPSCoordinate(
    [60.250690, 24.902729], 
    5,
    true
  )[1];
  return {
    storage_id: faker.helpers.arrayElement(['Storage A', 'Storage B']),
    price: faker.finance.amount(),
    Item_ID: faker.internet.password(),
    Item_name: faker.commerce.product(),
    User_address: [x1,y1], 
    Client_ID: users_list[Math.floor(Math.random() * users_list.length)], //maybe limit options??? Otherwise all users will be unique
    time: faker.date.between(
      '2020-08-01T00:00:00.000Z',
      '2023-03-01T00:00:00.000Z'
    ),
    status: faker.helpers.arrayElement(['On the way', 'Delivered']),
    // can also add names of users, zipcode, email, properties of package (size,weight...), also can add avatar picture
    // need to think of time it took to deliver
    dist_in_km: distance(60.250690, 24.902729, x1, y1),
    delivery_time_in_mins: (((distance(60.250690, 24.902729, x1, y1))/30)*60)+ Math.floor((Math.random() * 20) + 1),
  };
}

const user = createRandomUser(); //single user (was used for testing)



let user_values: User[] = []; // array of objects to store data

Array.from({ length: 10 }).forEach(() => {
  //change length parameter to define the data size, most likely we will have around 70 deliveries per day, we have 943 days -> 66 010 data samples
  user_values.push(createRandomUser());
});






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
    line converted: ${distance(60.250690, 24.902729, user_values[0].User_address[0], user_values[0].User_address[1])}
    <p>
    dist from class: ${user_values[0].dist_in_km}
    <p>
    deliv time : ${user_values[0].delivery_time_in_mins}
    <p>
  </div>  
</div>
`;
