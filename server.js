const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const base64 = require("base-64");
const utf8 = require("utf8");
const faker = require("@faker-js/faker");

const SECRET_KEY = "123456789";
const expiresIn = "1h";

const router = jsonServer.router("./db.json");

const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

server.use(jsonServer.defaults());

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
    const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));
    return (
        userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
    );
}

server.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
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
            res.status(200).json({ access_token, password, email, id });
        }
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

        const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

        const db = {
            users: [...userdb.users, userInfo],
        };
        console.log(db);
        fs.writeFile("./users.json", JSON.stringify(db), () => {
            console.log("Successfully :))");
        });
        const status = 200;
        const message = "Dang ky thanh cong";
        res.status(200).json({ status, message });
    }
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (
        req.headers.authorization === undefined ||
        req.headers.authorization.split(" ")[0] !== "Bearer"
    ) {
        const status = 401;
        const message = "Bad authorization header";
        res.status(status).json({ status, message });
        return;
    }
    try {
        verifyToken(req.headers.authorization.split(" ")[1]);
        next();
    } catch (err) {
        const status = 401;
        const message = "Error: access_token is not valid";
        res.status(status).json({ status, message });
    }
});

server.use(router);

server.listen(3000, () => {
    console.log("Run Auth API Server");
});
