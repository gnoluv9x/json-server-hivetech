// server.js
const queryString = require("query-string");
const fs = require("fs");
const jsonServer = require("json-server");
const server = jsonServer.create();

const middlewares = jsonServer.defaults();
const router = jsonServer.router("./db.json");

const PORT = process.env.PORT || 4110;

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const base64 = require("base-64");
const utf8 = require("utf8");
const faker = require("@faker-js/faker");

const SECRET_KEY = "123456789";
const expiresIn = "1h";

const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    const userdb = JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
    return (
        userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
    );
}
// get value from db.json
function getValueFromDB() {
    return JSON.parse(fs.readFileSync("./db.json", "UTF-8"));
}

server.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (isAuthenticated({ email, password }) === false) {
        const status = 401;
        const message = "Incorrect email or password";
        res.status(status).json({ status, message });
        return;
    } else {
        // get userID
        const userInfo = userdb.users.find(item => item.email === email);

        if (userInfo) {
            const { email, password, id } = userInfo;
            const bytes = utf8.encode(password);
            const encoded = base64.encode(bytes);
            const access_token = createToken({ email, password });
            res.status(200).json({ access_token, password: encoded, email, id });
        }
    }
});
// get user
server.get("/users", (req, res) => {
    const user = userdb.users;
    if (user) {
        res.jsonp(user);
    }
});

// /auth/register
server.post("/auth/register", (req, res) => {
    const { email, password } = req.body;
    if (isAuthenticated({ email, password })) {
        const status = 401;
        const message = "Tai khoan da ton tai";
        res.status(status).json({ status, message });
        return;
    } else {
        // get userID
        const userInfo = {
            id: faker.datatype.uuid(),
            email: email,
            password: password,
            name: email,
        };

        const userdb = getValueFromDB();

        const db = {
            restaurants: [...userdb.restaurants],
            users: [...userdb.users, userInfo],
        };
        fs.writeFile("./db.json", JSON.stringify(db), () => {
            console.log("Successfully :))");
        });

        const status = 200;
        const message = "Dang ky thanh cong";
        res.status(200).json({ status, message });
    }
});

// DELETE //restaurants/:id
server.delete("/restaurants/:id", (req, res) => {
    const userdb = getValueFromDB();
    const param = req.params;
    const listRest = userdb.restaurants;
    const index = listRest.findIndex(res => res.restaurantId === param.id);
    if (index !== -1) {
        const newRest = userdb.restaurants.filter(item => item.restaurantId !== param.id);

        const db = {
            restaurants: [...newRest],
            users: [...userdb.users],
        };

        fs.writeFile("./db.json", JSON.stringify(db), () => {
            console.log("Successfully :))");
        });

        const status = 200;
        const message = "Xoa file thanh cong";
        res.status(200).json({ status, message });
    } else {
        const status = 204;
        const message = "Xoa file that bai";
        res.status(200).json({ status, message });
    }
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server

server.use((req, res, next) => {
    if (req.method === "POST") {
        req.body.createdAt = Date.now();
        req.body.updatedAt = Date.now();
    }
    if (req.method === "PATCH") {
        req.body.updatedAt = Date.now();
    }
    // Continue to JSON Server router
    next();
});

router.render = (req, res) => {
    // Check GET with pagination
    // If yes, custom output
    const headers = res.getHeaders();

    const totalCountHeader = headers["x-total-count"];
    if (req.method === "GET" && totalCountHeader) {
        const queryParams = queryString.parse(req._parsedUrl.query);

        const result = {
            data: res.locals.data,
            pagination: {
                _page: Number.parseInt(queryParams._page) || 1,
                _limit: Number.parseInt(queryParams._limit) || 5,
                _totalRows: Number.parseInt(totalCountHeader),
            },
        };

        return res.jsonp(result);
    }
    // otherwise
    res.jsonp(res.locals.data);
};

server.use(middlewares);
server.use(router);
server.listen(PORT, () => {
    console.log(`JSON Server is running at port : ${PORT}`);
});
