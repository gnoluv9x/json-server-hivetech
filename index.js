// server.js
const queryString = require("query-string");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 4110;

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
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
server.use("/api", router);
server.listen(PORT, () => {
    console.log(`JSON Server is running at port : ${PORT}`);
});
