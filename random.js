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
        users: [],
    };
    // write to db.json
    fs.writeFile("./db.json", JSON.stringify(db), () => {
        console.log("Write Successfully =))");
    });
})();
