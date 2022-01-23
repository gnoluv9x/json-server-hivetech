const faker = require("@faker-js/faker");
const fs = require("fs");
//locale
faker.locale = "vi";

function randomListSetName(maxSetName) {
  if (maxSetName <= 0) return [];
  const listSetName = [];
  const randomSetName = Math.ceil(Math.random() * maxSetName);
  for (let i = 1; i <= randomSetName; i++) {
    listSetName.push(faker.animal.dog());
  }

  return listSetName;
}
function randomRestaurant(numbersOfRestaurant) {
  if (numbersOfRestaurant <= 0) return [];
  const listRestaurant = [];
  Array.from(new Array(numbersOfRestaurant)).forEach(() => {
    const restaurant = {
      restaurantId: faker.datatype.uuid(),
      restaurantName: faker.name.lastName("female"),
      phoneNumber: faker.phone.phoneNumber(),
      status: faker.datatype.boolean(),
      address: faker.address.cityName(),
      setName: randomListSetName(5),
    };

    listRestaurant.push(restaurant);
  });

  return listRestaurant;
}

(() => {
  const listRestaurant = randomRestaurant(40);
  // prepare data
  const db = {
    restaurants: listRestaurant,
    users: [
      {
        id: 1,
        email: "phamkien3@email.com",
        password: "123456",
        name: "phamkien3@email.com",
      },
      {
        id: 2,
        email: "phamkien4@email.com",
        password: "123456",
        name: "phamkien4@email.com",
      },
      {
        id: 3,
        email: "phamkien5@email.com",
        password: "123456",
        name: "phamkien5@email.com",
      },
      {
        id: 4,
        email: "vulongpt2@email.com",
        password: "123456",
        name: "vulongpt2@email.com",
      },
      {
        id: "4d0a544b-b7a6-436b-9c67-ee3528e49c3a",
        email: "vulongpt11@email.com",
        password: "123456",
        name: "vulongpt11@email.com",
      },
      {
        id: "75e91a11-b44a-49be-9fc0-0c4ae1dac676",
        email: "vulongpt12@email.com",
        password: "123456",
        name: "vulongpt12@email.com",
      },
      {
        id: "8a50a84a-4fb3-4208-8281-7f1252d5b1a0",
        email: "vulongpt13@email.com",
        password: "123456",
        name: "vulongpt13@email.com",
      },
      {
        id: "84ac5a74-cf25-40ac-a1ac-9d6af08c2200",
        email: "phamkien100@email.com",
        password: "123456",
        name: "phamkien100@email.com",
      },
      {
        id: "9d7c0080-f000-4087-8be2-27e90da84d82",
        email: "phamkien101@email.com",
        password: "123456",
        name: "phamkien101@email.com",
      },
    ],
  };
  // write to db.json
  fs.writeFile("./db.json", JSON.stringify(db), () => {
    console.log("Write Successfully =))");
  });
})();
