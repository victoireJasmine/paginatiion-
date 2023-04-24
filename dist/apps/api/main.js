/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/api/src/app/movies/movies.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const express_1 = __webpack_require__("express");
const MovieService = __webpack_require__("./apps/api/src/app/movies/movies.service.ts");
const paginate_1 = __webpack_require__("./apps/api/src/utils/paginate.ts");
const moviesRoutes = (0, express_1.Router)();
moviesRoutes.get('/', (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const limit = parseInt(req.query.limit, 10) || 1000;
        const offset = parseInt(req.query.offset, 10) || 0;
        const order = (_b = (_a = req.query) === null || _a === void 0 ? void 0 : _a.order) !== null && _b !== void 0 ? _b : 'title';
        const sort = (_d = (_c = req.query) === null || _c === void 0 ? void 0 : _c.sort) !== null && _d !== void 0 ? _d : 'asc';
        const nbData = yield MovieService.getNbMovies();
        const pagination = (0, paginate_1.paginate)({ offset, limit, order, sort }, nbData[0].numRows);
        if ('err' in pagination) {
            res.status(400).json(Object.assign({}, pagination));
        }
        const movies = yield MovieService.getMovies({ offset, limit, order, sort });
        res.status(200).json(Object.assign({ results: movies }, pagination));
    }
    catch (error) {
        console.error('[movies.controller][getMovies][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching movies'
        });
    }
}));
exports["default"] = moviesRoutes;


/***/ }),

/***/ "./apps/api/src/app/movies/movies.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNbMovies = exports.getMovies = void 0;
const tslib_1 = __webpack_require__("tslib");
const db_1 = __webpack_require__("./apps/api/src/config/db.ts");
/**
 * gets movies
 */
const getMovies = (paginate) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const orderby = {
        film_id: 'F.film_id',
        title: 'F.title',
        rating: 'F.rating',
        rental_rate: 'F.rental_rate',
        category: 'category',
        total_rental: 'total_rental',
    };
    let query = `
        SELECT F.film_id, F.title, F.rating, F.rental_rate, cat.name AS category, COUNT(inv.inventory_id) AS total_rental FROM film F 
        LEFT JOIN film_category fc ON fc.film_id = F.film_id
        LEFT JOIN category cat ON cat.category_id = fc.category_id
        LEFT JOIN inventory inv ON inv.film_id = F.film_id
        GROUP BY F.film_id
        ORDER BY ${orderby[paginate.order]} ${paginate.sort.toUpperCase()}
        LIMIT ${paginate.limit}
        OFFSET ${paginate.offset}
    `;
    return (0, db_1.execute)(query, []);
});
exports.getMovies = getMovies;
const getNbMovies = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    return (0, db_1.execute)(`SELECT count(*) as numRows FROM film`, []);
});
exports.getNbMovies = getNbMovies;


/***/ }),

/***/ "./apps/api/src/app/routes.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.moviesRoutes = void 0;
const movies_controller_1 = __webpack_require__("./apps/api/src/app/movies/movies.controller.ts");
exports.moviesRoutes = movies_controller_1.default;


/***/ }),

/***/ "./apps/api/src/config/db.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.execute = exports.init = void 0;
const mysql_1 = __webpack_require__("mysql");
let pool;
/**
 * generates pool connection to be used throughout the app
 */
const init = () => {
    try {
        pool = (0, mysql_1.createPool)({
            connectionLimit: 4,
            host: 'unixshell.hetic.glassworks.tech',
            port: 27116,
            user: 'student',
            password: 'Tk0Uc2o2mwqcnIA',
            database: 'sakila',
        });
        console.debug('MySql Adapter Pool generated successfully');
    }
    catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
};
exports.init = init;
/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
const execute = (query, params) => {
    try {
        if (!pool)
            throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error)
                    reject(error);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
};
exports.execute = execute;


/***/ }),

/***/ "./apps/api/src/utils/paginate.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paginate = void 0;
const paginate = (query, totalDataRows) => {
    let numRows;
    let numPages;
    const numPerPage = query.limit;
    const page = query.offset;
    numRows = totalDataRows;
    numPages = Math.ceil(numRows / numPerPage);
    if (page > numPages) {
        return {
            err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
        };
    }
    return {
        total: totalDataRows,
        order: query.order,
        sort: query.sort,
        current: page,
        perPage: numPerPage,
        previous: page > 0 ? page - 1 : undefined,
        next: page < numPages - 1 ? page + 1 : undefined
    };
};
exports.paginate = paginate;


/***/ }),

/***/ "cors":
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "mysql":
/***/ ((module) => {

module.exports = require("mysql");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __webpack_require__("express");
const routes_1 = __webpack_require__("./apps/api/src/app/routes.ts");
const MySQLConnector = __webpack_require__("./apps/api/src/config/db.ts");
const cors = __webpack_require__("cors");
const app = express();
// create database pool
MySQLConnector.init();
// parse incoming request body and append data to `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to api!' });
});
app.use('/api/movies', routes_1.moviesRoutes);
const port = process.env.port || 3333;
const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map