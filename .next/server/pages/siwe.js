"use strict";
(() => {
var exports = {};
exports.id = 952;
exports.ids = [952];
exports.modules = {

/***/ 9816:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5851);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1649);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6703);
/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(siwe__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8998);
/* harmony import */ var wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3226);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__]);
([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);







function Siwe() {
    const { signMessageAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useSignMessage)();
    const { chain  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useNetwork)();
    const { address , isConnected  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useAccount)();
    const { connect  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useConnect)({
        connector: new wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__.InjectedConnector()
    });
    const { data: session , status  } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.useSession)();
    const getSiweMessageOptions = ()=>({
            statement: "Sign in to my RainbowKit app"
        });
    const handleLogin = async ()=>{
        try {
            const callbackUrl = "/protected";
            const message = new siwe__WEBPACK_IMPORTED_MODULE_4__.SiweMessage({
                domain: window.location.host,
                address: address,
                statement: "Sign in with Ethereum to the app.",
                uri: window.location.origin,
                version: "1",
                chainId: chain?.id,
                nonce: await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.getCsrfToken)()
            });
            const signature = await signMessageAsync({
                message: message.prepareMessage()
            });
            (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.signIn)("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature,
                callbackUrl
            });
        } catch (error) {
            window.alert(error);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        console.log(isConnected);
        if (isConnected && !session) {
            handleLogin();
        }
    }, [
        isConnected
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__.RainbowKitSiweNextAuthProvider, {
            getSiweMessageOptions: getSiweMessageOptions,
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                onClick: (e)=>{
                    e.preventDefault();
                    if (!isConnected) {
                        connect();
                    } else {
                        handleLogin();
                    }
                },
                children: "Sign-in"
            })
        })
    });
}
async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.getCsrfToken)(context)
        }
    };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Siwe);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1649:
/***/ ((module) => {

module.exports = require("next-auth/react");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 6703:
/***/ ((module) => {

module.exports = require("siwe");

/***/ }),

/***/ 5851:
/***/ ((module) => {

module.exports = import("@rainbow-me/rainbowkit-siwe-next-auth");;

/***/ }),

/***/ 8998:
/***/ ((module) => {

module.exports = import("wagmi");;

/***/ }),

/***/ 3226:
/***/ ((module) => {

module.exports = import("wagmi/connectors/injected");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(9816));
module.exports = __webpack_exports__;

})();