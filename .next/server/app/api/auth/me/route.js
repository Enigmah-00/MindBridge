"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/me/route";
exports.ids = ["app/api/auth/me/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "argon2":
/*!*************************!*\
  !*** external "argon2" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("argon2");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_mahadi_Desktop_MindBridge_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/me/route.ts */ \"(rsc)/./src/app/api/auth/me/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/me/route\",\n        pathname: \"/api/auth/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/me/route\"\n    },\n    resolvedPagePath: \"/Users/mahadi/Desktop/MindBridge/src/app/api/auth/me/route.ts\",\n    nextConfigOutput,\n    userland: _Users_mahadi_Desktop_MindBridge_src_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRm1haGFkaSUyRkRlc2t0b3AlMkZNaW5kQnJpZGdlJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRm1haGFkaSUyRkRlc2t0b3AlMkZNaW5kQnJpZGdlJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNhO0FBQzFGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluZGJyaWRnZS8/OTM4NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvbWFoYWRpL0Rlc2t0b3AvTWluZEJyaWRnZS9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL21lL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9tZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9tZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9tYWhhZGkvRGVza3RvcC9NaW5kQnJpZGdlL3NyYy9hcHAvYXBpL2F1dGgvbWUvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvbWUvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/me/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/auth/me/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\nasync function GET() {\n    const s = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getSession)();\n    if (!s) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: false\n    }, {\n        status: 401\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        ok: true,\n        id: s.user.id,\n        username: s.user.username,\n        role: s.user.role\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL21lL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNIO0FBRWpDLGVBQWVFO0lBQ3BCLE1BQU1DLElBQUksTUFBTUYscURBQVVBO0lBQzFCLElBQUksQ0FBQ0UsR0FBRyxPQUFPSCxxREFBWUEsQ0FBQ0ksSUFBSSxDQUFDO1FBQUVDLElBQUk7SUFBTSxHQUFHO1FBQUVDLFFBQVE7SUFBSTtJQUM5RCxPQUFPTixxREFBWUEsQ0FBQ0ksSUFBSSxDQUFDO1FBQ3ZCQyxJQUFJO1FBQ0pFLElBQUlKLEVBQUVLLElBQUksQ0FBQ0QsRUFBRTtRQUNiRSxVQUFVTixFQUFFSyxJQUFJLENBQUNDLFFBQVE7UUFDekJDLE1BQU1QLEVBQUVLLElBQUksQ0FBQ0UsSUFBSTtJQUNuQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluZGJyaWRnZS8uL3NyYy9hcHAvYXBpL2F1dGgvbWUvcm91dGUudHM/NThiZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCBzID0gYXdhaXQgZ2V0U2Vzc2lvbigpO1xuICBpZiAoIXMpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiBmYWxzZSB9LCB7IHN0YXR1czogNDAxIH0pO1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgIG9rOiB0cnVlLFxuICAgIGlkOiBzLnVzZXIuaWQsXG4gICAgdXNlcm5hbWU6IHMudXNlci51c2VybmFtZSxcbiAgICByb2xlOiBzLnVzZXIucm9sZSxcbiAgfSk7XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImdldFNlc3Npb24iLCJHRVQiLCJzIiwianNvbiIsIm9rIiwic3RhdHVzIiwiaWQiLCJ1c2VyIiwidXNlcm5hbWUiLCJyb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/me/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   COOKIE_NAME: () => (/* binding */ COOKIE_NAME),\n/* harmony export */   clearAuthCookieOn: () => (/* binding */ clearAuthCookieOn),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   requireRole: () => (/* binding */ requireRole),\n/* harmony export */   requireSession: () => (/* binding */ requireSession),\n/* harmony export */   setAuthCookieOn: () => (/* binding */ setAuthCookieOn),\n/* harmony export */   signJwt: () => (/* binding */ signJwt),\n/* harmony export */   verifyJwt: () => (/* binding */ verifyJwt),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! argon2 */ \"argon2\");\n/* harmony import */ var argon2__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(argon2__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\n\n\nconst COOKIE_NAME = \"mb_token\";\nconst isProd = \"development\" === \"production\";\nasync function hashPassword(password) {\n    return argon2__WEBPACK_IMPORTED_MODULE_0___default().hash(password);\n}\nasync function verifyPassword(hash, password) {\n    return argon2__WEBPACK_IMPORTED_MODULE_0___default().verify(hash, password);\n}\nfunction signJwt(payload) {\n    const secret = process.env.JWT_SECRET;\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign(payload, secret, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyJwt(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, process.env.JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function getSession() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n    const token = cookieStore.get(COOKIE_NAME)?.value;\n    if (!token) return null;\n    const payload = verifyJwt(token);\n    if (!payload) return null;\n    const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n        where: {\n            id: payload.sub\n        }\n    });\n    if (!user) return null;\n    return {\n        user,\n        role: user.role,\n        token\n    };\n}\nasync function requireSession() {\n    const session = await getSession();\n    if (!session) {\n        throw new Error(\"Unauthorized\");\n    }\n    return session;\n}\nasync function requireRole(role) {\n    const session = await requireSession();\n    if (session.user.role !== role) {\n        throw new Error(\"Forbidden\");\n    }\n    return session;\n}\n// Set and clear cookie helpers (use inside API route handlers on the response)\nfunction setAuthCookieOn(res, token) {\n    res.cookies.set(COOKIE_NAME, token, {\n        httpOnly: true,\n        sameSite: \"lax\",\n        secure: isProd ? true : false,\n        path: \"/\",\n        maxAge: 60 * 60 * 24 * 7\n    });\n}\nfunction clearAuthCookieOn(res) {\n    res.cookies.delete(COOKIE_NAME);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE0QjtBQUNHO0FBQ1E7QUFFRDtBQUUvQixNQUFNSSxjQUFjLFdBQVc7QUFDdEMsTUFBTUMsU0FBU0Msa0JBQXlCO0FBSWpDLGVBQWVDLGFBQWFDLFFBQWdCO0lBQ2pELE9BQU9SLGtEQUFXLENBQUNRO0FBQ3JCO0FBRU8sZUFBZUUsZUFBZUQsSUFBWSxFQUFFRCxRQUFnQjtJQUNqRSxPQUFPUixvREFBYSxDQUFDUyxNQUFNRDtBQUM3QjtBQUVPLFNBQVNJLFFBQVFDLE9BQW1CO0lBQ3pDLE1BQU1DLFNBQVNSLFFBQVFTLEdBQUcsQ0FBQ0MsVUFBVTtJQUNyQyxPQUFPZix3REFBUSxDQUFDWSxTQUFTQyxRQUFRO1FBQUVJLFdBQVc7SUFBSztBQUNyRDtBQUVPLFNBQVNDLFVBQVVDLEtBQWE7SUFDckMsSUFBSTtRQUNGLE9BQU9uQiwwREFBVSxDQUFDbUIsT0FBT2QsUUFBUVMsR0FBRyxDQUFDQyxVQUFVO0lBQ2pELEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRU8sZUFBZUs7SUFDcEIsTUFBTUMsY0FBY3BCLHFEQUFPQTtJQUMzQixNQUFNa0IsUUFBUUUsWUFBWUMsR0FBRyxDQUFDbkIsY0FBY29CO0lBQzVDLElBQUksQ0FBQ0osT0FBTyxPQUFPO0lBQ25CLE1BQU1QLFVBQVVNLFVBQVVDO0lBQzFCLElBQUksQ0FBQ1AsU0FBUyxPQUFPO0lBQ3JCLE1BQU1ZLE9BQU8sTUFBTXRCLCtDQUFNQSxDQUFDc0IsSUFBSSxDQUFDQyxVQUFVLENBQUM7UUFBRUMsT0FBTztZQUFFQyxJQUFJZixRQUFRZ0IsR0FBRztRQUFDO0lBQUU7SUFDdkUsSUFBSSxDQUFDSixNQUFNLE9BQU87SUFDbEIsT0FBTztRQUFFQTtRQUFNSyxNQUFNTCxLQUFLSyxJQUFJO1FBQUVWO0lBQU07QUFDeEM7QUFFTyxlQUFlVztJQUNwQixNQUFNQyxVQUFVLE1BQU1YO0lBQ3RCLElBQUksQ0FBQ1csU0FBUztRQUNaLE1BQU0sSUFBSUMsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1Q7QUFFTyxlQUFlRSxZQUFZSixJQUFpQztJQUNqRSxNQUFNRSxVQUFVLE1BQU1EO0lBQ3RCLElBQUlDLFFBQVFQLElBQUksQ0FBQ0ssSUFBSSxLQUFLQSxNQUFNO1FBQzlCLE1BQU0sSUFBSUcsTUFBTTtJQUNsQjtJQUNBLE9BQU9EO0FBQ1Q7QUFFQSwrRUFBK0U7QUFDeEUsU0FBU0csZ0JBQWdCQyxHQUFpQixFQUFFaEIsS0FBYTtJQUM5RGdCLElBQUlsQyxPQUFPLENBQUNtQyxHQUFHLENBQUNqQyxhQUFhZ0IsT0FBTztRQUNsQ2tCLFVBQVU7UUFDVkMsVUFBVTtRQUNWQyxRQUFRbkMsU0FBUyxPQUFPO1FBQ3hCb0MsTUFBTTtRQUNOQyxRQUFRLEtBQUssS0FBSyxLQUFLO0lBQ3pCO0FBQ0Y7QUFFTyxTQUFTQyxrQkFBa0JQLEdBQWlCO0lBQ2pEQSxJQUFJbEMsT0FBTyxDQUFDMEMsTUFBTSxDQUFDeEM7QUFDckIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5kYnJpZGdlLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFyZ29uMiBmcm9tIFwiYXJnb24yXCI7XG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgdHlwZSB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuXG5leHBvcnQgY29uc3QgQ09PS0lFX05BTUUgPSBcIm1iX3Rva2VuXCI7XG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCI7XG5cbmV4cG9ydCB0eXBlIEp3dFBheWxvYWQgPSB7IHN1Yjogc3RyaW5nOyByb2xlOiBcIlVTRVJcIiB8IFwiRE9DVE9SXCIgfCBcIkFETUlOXCIgfTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKSB7XG4gIHJldHVybiBhcmdvbjIuaGFzaChwYXNzd29yZCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlQYXNzd29yZChoYXNoOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGFyZ29uMi52ZXJpZnkoaGFzaCwgcGFzc3dvcmQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbkp3dChwYXlsb2FkOiBKd3RQYXlsb2FkKSB7XG4gIGNvbnN0IHNlY3JldCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQhO1xuICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgc2VjcmV0LCB7IGV4cGlyZXNJbjogXCI3ZFwiIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5Snd0KHRva2VuOiBzdHJpbmcpOiBKd3RQYXlsb2FkIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQhKSBhcyBKd3RQYXlsb2FkO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbigpIHtcbiAgY29uc3QgY29va2llU3RvcmUgPSBjb29raWVzKCk7XG4gIGNvbnN0IHRva2VuID0gY29va2llU3RvcmUuZ2V0KENPT0tJRV9OQU1FKT8udmFsdWU7XG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuICBjb25zdCBwYXlsb2FkID0gdmVyaWZ5Snd0KHRva2VuKTtcbiAgaWYgKCFwYXlsb2FkKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogcGF5bG9hZC5zdWIgfSB9KTtcbiAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIHsgdXNlciwgcm9sZTogdXNlci5yb2xlLCB0b2tlbiB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWlyZVNlc3Npb24oKSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gIGlmICghc2Vzc2lvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVuYXV0aG9yaXplZFwiKTtcbiAgfVxuICByZXR1cm4gc2Vzc2lvbjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVSb2xlKHJvbGU6IFwiVVNFUlwiIHwgXCJET0NUT1JcIiB8IFwiQURNSU5cIikge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgcmVxdWlyZVNlc3Npb24oKTtcbiAgaWYgKHNlc3Npb24udXNlci5yb2xlICE9PSByb2xlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRm9yYmlkZGVuXCIpO1xuICB9XG4gIHJldHVybiBzZXNzaW9uO1xufVxuXG4vLyBTZXQgYW5kIGNsZWFyIGNvb2tpZSBoZWxwZXJzICh1c2UgaW5zaWRlIEFQSSByb3V0ZSBoYW5kbGVycyBvbiB0aGUgcmVzcG9uc2UpXG5leHBvcnQgZnVuY3Rpb24gc2V0QXV0aENvb2tpZU9uKHJlczogTmV4dFJlc3BvbnNlLCB0b2tlbjogc3RyaW5nKSB7XG4gIHJlcy5jb29raWVzLnNldChDT09LSUVfTkFNRSwgdG9rZW4sIHtcbiAgICBodHRwT25seTogdHJ1ZSxcbiAgICBzYW1lU2l0ZTogXCJsYXhcIixcbiAgICBzZWN1cmU6IGlzUHJvZCA/IHRydWUgOiBmYWxzZSwgLy8gYWxsb3cgSFRUUCBvbiBsb2NhbGhvc3RcbiAgICBwYXRoOiBcIi9cIixcbiAgICBtYXhBZ2U6IDYwICogNjAgKiAyNCAqIDcsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJBdXRoQ29va2llT24ocmVzOiBOZXh0UmVzcG9uc2UpIHtcbiAgcmVzLmNvb2tpZXMuZGVsZXRlKENPT0tJRV9OQU1FKTtcbn0iXSwibmFtZXMiOlsiYXJnb24yIiwiand0IiwiY29va2llcyIsInByaXNtYSIsIkNPT0tJRV9OQU1FIiwiaXNQcm9kIiwicHJvY2VzcyIsImhhc2hQYXNzd29yZCIsInBhc3N3b3JkIiwiaGFzaCIsInZlcmlmeVBhc3N3b3JkIiwidmVyaWZ5Iiwic2lnbkp3dCIsInBheWxvYWQiLCJzZWNyZXQiLCJlbnYiLCJKV1RfU0VDUkVUIiwic2lnbiIsImV4cGlyZXNJbiIsInZlcmlmeUp3dCIsInRva2VuIiwiZ2V0U2Vzc2lvbiIsImNvb2tpZVN0b3JlIiwiZ2V0IiwidmFsdWUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaWQiLCJzdWIiLCJyb2xlIiwicmVxdWlyZVNlc3Npb24iLCJzZXNzaW9uIiwiRXJyb3IiLCJyZXF1aXJlUm9sZSIsInNldEF1dGhDb29raWVPbiIsInJlcyIsInNldCIsImh0dHBPbmx5Iiwic2FtZVNpdGUiLCJzZWN1cmUiLCJwYXRoIiwibWF4QWdlIiwiY2xlYXJBdXRoQ29va2llT24iLCJkZWxldGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  false ? 0 : [\n        \"error\",\n        \"warn\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUNYRixnQkFBZ0JFLE1BQU0sSUFDdEIsSUFBSUgsd0RBQVlBLENBQUM7SUFDZkksS0FBS0MsTUFBcUMsR0FBRyxDQUFTLEdBQUc7UUFBQztRQUFTO0tBQU87QUFDNUUsR0FBRztBQUVMLElBQUlBLElBQXFDLEVBQUVKLGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL21pbmRicmlkZ2UvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWwgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IH07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxuICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/XG4gIG5ldyBQcmlzbWFDbGllbnQoe1xuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gW1wiZXJyb3JcIl0gOiBbXCJlcnJvclwiLCBcIndhcm5cIl0sXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hOyJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWwiLCJwcmlzbWEiLCJsb2ciLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fmahadi%2FDesktop%2FMindBridge&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();