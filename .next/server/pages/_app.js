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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/pages/_app.jsx":
/*!****************************!*\
  !*** ./src/pages/_app.jsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/tailwind.css */ \"./src/styles/tailwind.css\");\n/* harmony import */ var _styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rainbow-me/rainbowkit-siwe-next-auth */ \"@rainbow-me/rainbowkit-siwe-next-auth\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"@rainbow-me/rainbowkit\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/chains */ \"wagmi/chains\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! wagmi/providers/public */ \"wagmi/providers/public\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_2__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_chains__WEBPACK_IMPORTED_MODULE_6__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_7__]);\n([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_2__, _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_chains__WEBPACK_IMPORTED_MODULE_6__, wagmi_providers_public__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\nfunction App({ Component , pageProps  }) {\n    const { chains , provider  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.configureChains)([\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_6__.mainnet,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_6__.polygon,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_6__.optimism,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_6__.polygonMumbai\n    ], [\n        (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_7__.publicProvider)()\n    ]);\n    const { connectors  } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.getDefaultWallets)({\n        appName: \"DataHack\",\n        projectId: \"YOUR_PROJECT_ID\",\n        chains\n    });\n    const client = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.createClient)({\n        autoConnect: true,\n        connectors,\n        provider\n    });\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_5__.WagmiConfig, {\n        client: client,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_4__.SessionProvider, {\n            refetchInterval: 0,\n            session: pageProps.session,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_2__.RainbowKitSiweNextAuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.RainbowKitProvider, {\n                    chains: chains,\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                        lineNumber: 41,\n                        columnNumber: 13\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                    lineNumber: 40,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                lineNumber: 39,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n            lineNumber: 38,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n        lineNumber: 37,\n        columnNumber: 3\n    }, this);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qc3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBK0I7QUFDd0Q7QUFFUjtBQUNwQztBQUNPO0FBQ2lCO0FBQ007QUFDakI7QUFJekMsU0FBU1ksR0FBRyxDQUFDLEVBQUVDLFNBQVMsR0FBRUMsU0FBUyxHQUFFLEVBQUU7SUFDcEQsTUFBTSxFQUFFQyxNQUFNLEdBQUVDLFFBQVEsR0FBRSxHQUFHWCxzREFBZSxDQUMxQztRQUFDRSxpREFBTztRQUFFRSxpREFBTztRQUFFRCxrREFBUTtRQUFFRSx1REFBYTtLQUFDLEVBRXpDO1FBQUNDLHNFQUFjLEVBQUU7S0FBQyxDQUVyQjtJQUNELE1BQU0sRUFBRU0sVUFBVSxHQUFFLEdBQUdmLHlFQUFpQixDQUFDO1FBQ3ZDZ0IsT0FBTyxFQUFFLFVBQVU7UUFDbkJDLFNBQVMsRUFBRSxpQkFBaUI7UUFDNUJKLE1BQU07S0FDUCxDQUFDO0lBR0YsTUFBTUssTUFBTSxHQUFHZCxtREFBWSxDQUFDO1FBQzFCZSxXQUFXLEVBQUUsSUFBSTtRQUNqQkosVUFBVTtRQUNWRCxRQUFRO0tBQ1QsQ0FBQztJQUtGLHFCQUNBLDhEQUFDWiw4Q0FBVztRQUFDZ0IsTUFBTSxFQUFFQSxNQUFNO2tCQUN2Qiw0RUFBQ2pCLDREQUFlO1lBQUNtQixlQUFlLEVBQUUsQ0FBQztZQUFFQyxPQUFPLEVBQUVULFNBQVMsQ0FBQ1MsT0FBTztzQkFDN0QsNEVBQUN2QixpR0FBOEI7MEJBQzdCLDRFQUFDQyxzRUFBa0I7b0JBQUNjLE1BQU0sRUFBRUEsTUFBTTs4QkFDaEMsNEVBQUNGLFNBQVM7d0JBQUUsR0FBR0MsU0FBUzs7Ozs7NEJBQUk7Ozs7O3dCQUNUOzs7OztvQkFDVTs7Ozs7Z0JBQ2pCOzs7OztZQUNOLENBQ2Q7QUFDSixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGFpbHdpbmR1aS1wb2NrZXQvLi9zcmMvcGFnZXMvX2FwcC5qc3g/NGM3NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0Avc3R5bGVzL3RhaWx3aW5kLmNzcyc7XG5pbXBvcnQgeyBSYWluYm93S2l0U2l3ZU5leHRBdXRoUHJvdmlkZXIgfSBmcm9tICdAcmFpbmJvdy1tZS9yYWluYm93a2l0LXNpd2UtbmV4dC1hdXRoJztcblxuaW1wb3J0IHsgUmFpbmJvd0tpdFByb3ZpZGVyLCBnZXREZWZhdWx0V2FsbGV0cyB9IGZyb20gJ0ByYWluYm93LW1lL3JhaW5ib3draXQnO1xuaW1wb3J0ICdAcmFpbmJvdy1tZS9yYWluYm93a2l0L3N0eWxlcy5jc3MnO1xuaW1wb3J0IHsgU2Vzc2lvblByb3ZpZGVyIH0gZnJvbSAnbmV4dC1hdXRoL3JlYWN0JztcbmltcG9ydCB7IFdhZ21pQ29uZmlnLCBjb25maWd1cmVDaGFpbnMsIGNyZWF0ZUNsaWVudCB9IGZyb20gJ3dhZ21pJztcbmltcG9ydCB7IG1haW5uZXQsIG9wdGltaXNtLCBwb2x5Z29uLCBwb2x5Z29uTXVtYmFpIH0gZnJvbSAnd2FnbWkvY2hhaW5zJztcbmltcG9ydCB7IHB1YmxpY1Byb3ZpZGVyIH0gZnJvbSBcIndhZ21pL3Byb3ZpZGVycy9wdWJsaWNcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3QgeyBjaGFpbnMsIHByb3ZpZGVyIH0gPSBjb25maWd1cmVDaGFpbnMoXG4gICAgW21haW5uZXQsIHBvbHlnb24sIG9wdGltaXNtLCBwb2x5Z29uTXVtYmFpXSxcblxuICAgICAgW3B1YmxpY1Byb3ZpZGVyKCldXG4gICAgXG4gICk7XG4gIGNvbnN0IHsgY29ubmVjdG9ycyB9ID0gZ2V0RGVmYXVsdFdhbGxldHMoe1xuICAgIGFwcE5hbWU6ICdEYXRhSGFjaycsXG4gICAgcHJvamVjdElkOiAnWU9VUl9QUk9KRUNUX0lEJyxcbiAgICBjaGFpbnNcbiAgfSk7XG4gIFxuICBcbiAgY29uc3QgY2xpZW50ID0gY3JlYXRlQ2xpZW50KHtcbiAgICBhdXRvQ29ubmVjdDogdHJ1ZSxcbiAgICBjb25uZWN0b3JzLFxuICAgIHByb3ZpZGVyLFxuICB9KVxuICBcbiAgXG5cbiAgXG4gIHJldHVybiAoXG4gIDxXYWdtaUNvbmZpZyBjbGllbnQ9e2NsaWVudH0+XG4gICAgICA8U2Vzc2lvblByb3ZpZGVyIHJlZmV0Y2hJbnRlcnZhbD17MH0gc2Vzc2lvbj17cGFnZVByb3BzLnNlc3Npb259PlxuICAgICAgICA8UmFpbmJvd0tpdFNpd2VOZXh0QXV0aFByb3ZpZGVyPlxuICAgICAgICAgIDxSYWluYm93S2l0UHJvdmlkZXIgY2hhaW5zPXtjaGFpbnN9ID5cbiAgICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAgICA8L1JhaW5ib3dLaXRQcm92aWRlcj5cbiAgICAgICAgPC9SYWluYm93S2l0U2l3ZU5leHRBdXRoUHJvdmlkZXI+XG4gICAgICA8L1Nlc3Npb25Qcm92aWRlcj5cbiAgICA8L1dhZ21pQ29uZmlnPlxuICAgKVxufVxuIl0sIm5hbWVzIjpbIlJhaW5ib3dLaXRTaXdlTmV4dEF1dGhQcm92aWRlciIsIlJhaW5ib3dLaXRQcm92aWRlciIsImdldERlZmF1bHRXYWxsZXRzIiwiU2Vzc2lvblByb3ZpZGVyIiwiV2FnbWlDb25maWciLCJjb25maWd1cmVDaGFpbnMiLCJjcmVhdGVDbGllbnQiLCJtYWlubmV0Iiwib3B0aW1pc20iLCJwb2x5Z29uIiwicG9seWdvbk11bWJhaSIsInB1YmxpY1Byb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiY2hhaW5zIiwicHJvdmlkZXIiLCJjb25uZWN0b3JzIiwiYXBwTmFtZSIsInByb2plY3RJZCIsImNsaWVudCIsImF1dG9Db25uZWN0IiwicmVmZXRjaEludGVydmFsIiwic2Vzc2lvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.jsx\n");

/***/ }),

/***/ "./src/styles/tailwind.css":
/*!*********************************!*\
  !*** ./src/styles/tailwind.css ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("next-auth/react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@rainbow-me/rainbowkit":
/*!*****************************************!*\
  !*** external "@rainbow-me/rainbowkit" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit");;

/***/ }),

/***/ "@rainbow-me/rainbowkit-siwe-next-auth":
/*!********************************************************!*\
  !*** external "@rainbow-me/rainbowkit-siwe-next-auth" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@rainbow-me/rainbowkit-siwe-next-auth");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/chains":
/*!*******************************!*\
  !*** external "wagmi/chains" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/chains");;

/***/ }),

/***/ "wagmi/providers/public":
/*!*****************************************!*\
  !*** external "wagmi/providers/public" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("wagmi/providers/public");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.jsx"));
module.exports = __webpack_exports__;

})();