"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405,511];
exports.modules = {

/***/ 6624:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ModalLayout)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _headlessui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1185);
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2135);
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_headlessui_react__WEBPACK_IMPORTED_MODULE_1__]);
_headlessui_react__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




function ModalLayout({ children  }) {
    const { 0: open , 1: setOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(true);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition.Root, {
        show: open,
        as: react__WEBPACK_IMPORTED_MODULE_3__.Fragment,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Dialog, {
            as: "div",
            className: "relative z-10",
            onClose: setOpen,
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition.Child, {
                    as: react__WEBPACK_IMPORTED_MODULE_3__.Fragment,
                    enter: "ease-out duration-300",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "ease-in duration-200",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    })
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "fixed inset-0 z-10 overflow-y-auto",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Transition.Child, {
                            as: react__WEBPACK_IMPORTED_MODULE_3__.Fragment,
                            enter: "ease-out duration-300",
                            enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                            enterTo: "opacity-100 translate-y-0 sm:scale-100",
                            leave: "ease-in duration-200",
                            leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
                            leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_headlessui_react__WEBPACK_IMPORTED_MODULE_1__.Dialog.Panel, {
                                className: "relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "absolute right-0 top-0 hidden pr-4 pt-4 sm:block",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                            type: "button",
                                            className: "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                            onClick: ()=>setOpen(false),
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "sr-only",
                                                    children: "Close"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_2__.XMarkIcon, {
                                                    className: "h-6 w-6",
                                                    "aria-hidden": "true"
                                                })
                                            ]
                                        })
                                    }),
                                    children
                                ]
                            })
                        })
                    })
                })
            ]
        })
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7115:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ UploadModal)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2135);
/* harmony import */ var _heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7748);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1982);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ethers__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ModalLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6624);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_ModalLayout__WEBPACK_IMPORTED_MODULE_5__]);
_ModalLayout__WEBPACK_IMPORTED_MODULE_5__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






function UploadModal({ onClose  }) {
    const { 0: files , 1: setFiles  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
    const encryptionSignature = async ()=>{
        const provider = new ethers__WEBPACK_IMPORTED_MODULE_3__.ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const messageRequested = (await _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_2___default().getAuthMessage(address)).data.message;
        const signedMessage = await signer.signMessage(messageRequested);
        return {
            signedMessage: signedMessage,
            publicKey: address
        };
    };
    const progressCallback = (progressData)=>{
        let percentageDone = 100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };
    /* Deploy file along with encryption */ const uploadFileEncrypted = async (e)=>{
        /*
           uploadEncrypted(e, accessToken, publicKey, signedMessage, uploadProgressCallback)
           - e: js event
           - accessToken: your API key
           - publicKey: wallets public key
           - signedMessage: message signed by the owner of publicKey
           - uploadProgressCallback: function to get progress (optional)
        */ const sig = await encryptionSignature();
        const response = await _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_2___default().uploadEncrypted(e, "b9b0a58c.978d9c2b57f143c196ccb8aa762cd1a1", sig.publicKey, sig.signedMessage, progressCallback);
        console.log(response);
        setFiles(e.target.files);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_ModalLayout__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {
        onClose: onClose,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("dd", {
                    className: "mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                        role: "list",
                        className: "divide-y divide-gray-200 rounded-md border border-gray-200",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                className: "flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray",
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "flex w-0 flex-1 items-center",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__.PaperClipIcon, {
                                            className: "h-5 w-5 flex-shrink-0 text-gray-400",
                                            "aria-hidden": "true"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            className: "ml-2 w-0 flex-1 truncate",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                                type: "file",
                                                id: "image",
                                                name: "image",
                                                multiple: true,
                                                accept: "image/*",
                                                onChange: (e)=>uploadFileEncrypted(e),
                                                className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            })
                                        })
                                    ]
                                })
                            }),
                            Array.from(files).map((file)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", {
                                    className: "flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                            className: "flex w-0 flex-1 items-center",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_heroicons_react_24_outline__WEBPACK_IMPORTED_MODULE_1__.PaperClipIcon, {
                                                    className: "h-5 w-5 flex-shrink-0 text-gray-400",
                                                    "aria-hidden": "true"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "ml-2 w-0 flex-1 truncate",
                                                    children: file.name
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "ml-4 flex flex-shrink-0 space-x-4",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                type: "button",
                                                onClick: console.log("download"),
                                                className: "rounded-md bg-white font-medium text-indigo-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                                                children: "Remove"
                                            })
                                        })
                                    ]
                                }, file.name))
                        ]
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mt-5 sm:mt-4 sm:flex sm:flex-row-reverse",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                    type: "button",
                    className: "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto",
                    onClick: onClose,
                    children: "Cancel"
                })
            })
        ]
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3971:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ CardTable)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7748);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _UploadModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7115);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_UploadModal__WEBPACK_IMPORTED_MODULE_3__]);
_UploadModal__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




function CardTable({ address  }) {
    const { 0: isModalOpen , 1: setIsModalOpen  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const { 0: files , 1: setFiles  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
    const { 0: totalFiles , 1: setTotalFiles  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        const getFiles = async ()=>{
            console.log(address);
            const uploads = await _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1___default().getUploads(address);
            setFiles(uploads.data.fileList);
            setTotalFiles(uploads.data.totalFiles);
        /*    data: {
                   fileList: [
                     {
                       publicKey: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
                       fileName: 'flow1.png',
                       mimeType: 'image/png',
                       txHash: '0x7c9ee1585be6b85bef471a27535fb4b8d7551340152c36c025743c36fd0d1acc',
                       status: 'testnet',
                       createdAt: 1662880331683,
                       fileSizeInBytes: '31735',
                       cid: 'QmZvWp5Xdyi7z5QqGdXZP63QCBNoNvjupF1BohDULQcicA',
                       id: 'aaab8053-0f1e-4482-9f84-d413fad14266',
                       lastUpdate: 1662883207149,
                       encryption: true
                     },  
                   ],
                   totalFiles: 1 */ };
        getFiles();
    }, []);
    const openModal = ()=>{
        setIsModalOpen(!isModalOpen);
    };
    const closeModal = ()=>{
        setIsModalOpen(false);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "px-4 sm:px-6 lg:px-8",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "sm:flex sm:items-center",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "sm:flex-auto",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                                className: "text-base font-semibold leading-6 text-gray-900",
                                children: "Files"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                className: "mt-2 text-sm text-gray-700",
                                children: "Below find all the files uploaded by you."
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "mt-4 sm:ml-16 sm:mt-0 sm:flex-none",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            type: "button",
                            onClick: openModal,
                            className: "block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                            children: "Add file"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mt-4 sm:flex sm:items-center",
                children: isModalOpen && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_UploadModal__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z, {
                    onClose: closeModal
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "mt-8 flow-root",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8",
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
                                className: "min-w-full divide-y divide-gray-300",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("thead", {
                                        className: "bg-gray-50",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                                    scope: "col",
                                                    className: "py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
                                                    children: "name"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                                    scope: "col",
                                                    className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                                                    children: "size"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                                    scope: "col",
                                                    className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                                                    children: "Type"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                                    scope: "col",
                                                    className: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                                                    children: "uploadDate"
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("th", {
                                                    scope: "col",
                                                    className: "relative py-3.5 pl-3 pr-4 sm:pr-6",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                        className: "sr-only",
                                                        children: "Edit"
                                                    })
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tbody", {
                                        className: "divide-y divide-gray-200 bg-white",
                                        children: totalFiles > 0 ? files.map((item)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("td", {
                                                        className: "whitespace-nowrap flex flex-row items-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
                                                        children: [
                                                            item.encryption ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                className: "-ml-0.5 mr-1.5 h-2 w-2 text-green-400",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 8 8",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                                    cx: 4,
                                                                    cy: 4,
                                                                    r: 3
                                                                })
                                                            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                                                                className: "-ml-0.5 mr-1.5 h-2 w-2 text-red-400",
                                                                fill: "currentColor",
                                                                viewBox: "0 0 8 8",
                                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                                    cx: 4,
                                                                    cy: 4,
                                                                    r: 3
                                                                })
                                                            }),
                                                            item.fileName
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                        className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                                                        children: item.fileSizeInBytes
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                        className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                                                        children: item.mimeType
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                        className: "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
                                                        children: item.createdAt
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                        className: "relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6",
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                                                            href: "#",
                                                            className: "text-indigo-600 hover:text-indigo-900",
                                                            children: [
                                                                "Edit",
                                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                    className: "sr-only",
                                                                    children: [
                                                                        ", ",
                                                                        item.name
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    })
                                                ]
                                            }, item.id)) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("tr", {
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("td", {
                                                className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900",
                                                children: "No files found"
                                            })
                                        })
                                    })
                                ]
                            })
                        })
                    })
                })
            })
        ]
    });
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3492:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Stats)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7748);
/* harmony import */ var _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);

const stats = (/* unused pure expression or super */ null && ([]));


function Stats({ address  }) {
    const { 0: balance , 1: setBalance  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0);
    const { 0: stats , 1: setStats  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)([
        {
            name: "Total Subscribers",
            stat: "71,897"
        },
        {
            name: "Avg. Open Rate",
            stat: "58.16%"
        },
        {
            name: "Avg. Click Rate",
            stat: "24.57%"
        }, 
    ]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        const getBalance = async ()=>{
            const balance = await _lighthouse_web3_sdk__WEBPACK_IMPORTED_MODULE_1___default().getBalance(address);
            setBalance(balance);
            console.log(balance);
            let newStats = [
                {
                    name: "Data Limit",
                    stat: balance.data.dataLimit
                },
                {
                    name: "Data Used",
                    stat: balance.data.dataUsed
                }, 
            ];
            setStats(newStats);
        };
        getBalance();
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                className: "text-base font-semibold leading-6 text-gray-900",
                children: "Last 30 days"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("dl", {
                className: "mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3",
                children: stats.map((item)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("dt", {
                                className: "truncate text-sm font-medium text-gray-500",
                                children: item.name
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("dd", {
                                className: "mt-1 text-3xl font-semibold tracking-tight text-gray-900",
                                children: item.stat
                            })
                        ]
                    }, item.name))
            })
        ]
    });
}; /* 交流QQ群:7五45737七八 */ 


/***/ }),

/***/ 4325:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Home),
/* harmony export */   "getServerSideProps": () => (/* binding */ getServerSideProps)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_application_CardTable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3971);
/* harmony import */ var _components_application_Stats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3492);
/* harmony import */ var next_auth_jwt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(614);
/* harmony import */ var next_auth_jwt__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_auth_jwt__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1649);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4689);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_application_CardTable__WEBPACK_IMPORTED_MODULE_1__, _Layout__WEBPACK_IMPORTED_MODULE_5__]);
([_components_application_CardTable__WEBPACK_IMPORTED_MODULE_1__, _Layout__WEBPACK_IMPORTED_MODULE_5__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






/* 交流QQ群:75四573778 */ const data = [
    {
        "id": 1,
        "name": "sales_data_2022.csv",
        "type": "CSV",
        "size": "20.5 MB",
        "uploadDate": "2023-04-10T14:30:00.000Z",
        "encrypted": true
    },
    {
        "id": 2,
        "name": "customer_info.xlsx",
        "type": "Excel",
        "size": "5.3 MB",
        "uploadDate": "2023-04-15T09:20:00.000Z",
        "encrypted": true
    },
    {
        "id": 3,
        "name": "product_catalog.pdf",
        "type": "PDF",
        "size": "12.8 MB",
        "uploadDate": "2023-04-18T16:45:00.000Z",
        "encrypted": true
    },
    {
        "id": 4,
        "name": "employee_records.json",
        "type": "JSON",
        "size": "3.7 MB",
        "uploadDate": "2023-04-22T11:15:00.000Z",
        "encrypted": true
    },
    {
        "id": 5,
        "name": "marketing_strategy.pptx",
        "type": "PowerPoint",
        "size": "25.1 MB",
        "uploadDate": "2023-04-25T10:05:00.000Z",
        "encrypted": true
    },
    {
        "id": 6,
        "name": "expense_report_2022.csv",
        "type": "CSV",
        "size": "15.8 MB",
        "uploadDate": "2023-04-12T11:20:00.000Z",
        "encrypted": true
    },
    {
        "id": 7,
        "name": "inventory_list.xlsx",
        "type": "Excel",
        "size": "8.4 MB",
        "uploadDate": "2023-04-17T10:50:00.000Z",
        "encrypted": true
    },
    {
        "id": 8,
        "name": "contract_template.pdf",
        "type": "PDF",
        "size": "4.6 MB",
        "uploadDate": "2023-04-19T15:30:00.000Z",
        "encrypted": true
    },
    {
        "id": 9,
        "name": "user_preferences.json",
        "type": "JSON",
        "size": "2.9 MB",
        "uploadDate": "2023-04-23T17:15:00.000Z",
        "encrypted": true
    },
    {
        "id": 10,
        "name": "project_timeline.pptx",
        "type": "PowerPoint",
        "size": "18.7 MB",
        "uploadDate": "2023-04-26T14:45:00.000Z",
        "encrypted": true
    }
];
function Home({ address  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Layout__WEBPACK_IMPORTED_MODULE_5__["default"], {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("main", {
            className: "flex flex-col gap-12",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_application_Stats__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                    address: address
                }),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_application_CardTable__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, {
                    data: data,
                    address: address
                })
            ]
        })
    });
};
const getServerSideProps = async (context)=>{
    const session = await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.getSession)(context);
    const token = await (0,next_auth_jwt__WEBPACK_IMPORTED_MODULE_3__.getToken)({
        req: context.req
    });
    const address = token?.sub ?? null;
    // If you have a value for "address" here, your
    // server knows the user is authenticated.
    // You can then pass any data you want
    // to the page component here.
    return {
        props: {
            address,
            session
        }
    };
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2135:
/***/ ((module) => {

module.exports = require("@heroicons/react/24/outline");

/***/ }),

/***/ 7748:
/***/ ((module) => {

module.exports = require("@lighthouse-web3/sdk");

/***/ }),

/***/ 1982:
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = require("next-auth/jwt");

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

/***/ 1185:
/***/ ((module) => {

module.exports = import("@headlessui/react");;

/***/ }),

/***/ 6921:
/***/ ((module) => {

module.exports = import("@rainbow-me/rainbowkit");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [689], () => (__webpack_exec__(4325)));
module.exports = __webpack_exports__;

})();