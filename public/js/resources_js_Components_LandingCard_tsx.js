"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_Components_LandingCard_tsx"],{

/***/ "./resources/js/Components/Aceternity/3d-card.tsx":
/*!********************************************************!*\
  !*** ./resources/js/Components/Aceternity/3d-card.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CardBody: () => (/* binding */ CardBody),
/* harmony export */   CardContainer: () => (/* binding */ CardContainer),
/* harmony export */   CardItem: () => (/* binding */ CardItem),
/* harmony export */   useMouseEnter: () => (/* binding */ useMouseEnter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/utils */ "./resources/js/lib/utils.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
"use client";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};



var MouseEnterContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)(undefined);
var CardContainer = function CardContainer(_ref) {
  var children = _ref.children,
    className = _ref.className,
    containerClassName = _ref.containerClassName;
  var containerRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isMouseEntered = _useState2[0],
    setIsMouseEntered = _useState2[1];
  var handleMouseMove = function handleMouseMove(e) {
    if (!containerRef.current) return;
    var _containerRef$current = containerRef.current.getBoundingClientRect(),
      left = _containerRef$current.left,
      top = _containerRef$current.top,
      width = _containerRef$current.width,
      height = _containerRef$current.height;
    var x = (e.clientX - left - width / 2) / 25;
    var y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = "rotateY(".concat(x, "deg) rotateX(").concat(y, "deg)");
  };
  var handleMouseEnter = function handleMouseEnter(e) {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };
  var handleMouseLeave = function handleMouseLeave(e) {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MouseEnterContext.Provider, {
    value: [isMouseEntered, setIsMouseEntered],
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("py-20 flex items-center justify-center", containerClassName),
      style: {
        perspective: "1000px"
      },
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
        ref: containerRef,
        onMouseEnter: handleMouseEnter,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("flex items-center justify-center relative transition-all duration-200 ease-linear", className),
        style: {
          transformStyle: "preserve-3d"
        },
        children: children
      })
    })
  });
};
var CardBody = function CardBody(_ref2) {
  var children = _ref2.children,
    className = _ref2.className;
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]", className),
    children: children
  });
};
var CardItem = function CardItem(_a) {
  var _a$as = _a.as,
    Tag = _a$as === void 0 ? "div" : _a$as,
    children = _a.children,
    className = _a.className,
    _a$translateX = _a.translateX,
    translateX = _a$translateX === void 0 ? 0 : _a$translateX,
    _a$translateY = _a.translateY,
    translateY = _a$translateY === void 0 ? 0 : _a$translateY,
    _a$translateZ = _a.translateZ,
    translateZ = _a$translateZ === void 0 ? 0 : _a$translateZ,
    _a$rotateX = _a.rotateX,
    rotateX = _a$rotateX === void 0 ? 0 : _a$rotateX,
    _a$rotateY = _a.rotateY,
    rotateY = _a$rotateY === void 0 ? 0 : _a$rotateY,
    _a$rotateZ = _a.rotateZ,
    rotateZ = _a$rotateZ === void 0 ? 0 : _a$rotateZ,
    rest = __rest(_a, ["as", "children", "className", "translateX", "translateY", "translateZ", "rotateX", "rotateY", "rotateZ"]);
  var ref = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  var _useMouseEnter = useMouseEnter(),
    _useMouseEnter2 = _slicedToArray(_useMouseEnter, 1),
    isMouseEntered = _useMouseEnter2[0];
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    handleAnimations();
  }, [isMouseEntered]);
  var handleAnimations = function handleAnimations() {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = "translateX(".concat(translateX, "px) translateY(").concat(translateY, "px) translateZ(").concat(translateZ, "px) rotateX(").concat(rotateX, "deg) rotateY(").concat(rotateY, "deg) rotateZ(").concat(rotateZ, "deg)");
    } else {
      ref.current.style.transform = "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";
    }
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Tag, Object.assign({
    ref: ref,
    className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_1__.cn)("w-fit transition duration-200 ease-linear", className)
  }, rest, {
    children: children
  }));
};
// Create a hook to use the context
var useMouseEnter = function useMouseEnter() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};

/***/ }),

/***/ "./resources/js/Components/LandingCard.tsx":
/*!*************************************************!*\
  !*** ./resources/js/Components/LandingCard.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");
/* harmony import */ var _Aceternity_3d_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Aceternity/3d-card */ "./resources/js/Components/Aceternity/3d-card.tsx");


var LandingCard = function LandingCard() {
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Aceternity_3d_card__WEBPACK_IMPORTED_MODULE_1__.CardContainer, {
    className: "h-full",
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Aceternity_3d_card__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
      className: "bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ",
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Aceternity_3d_card__WEBPACK_IMPORTED_MODULE_1__.CardItem, {
        translateZ: "50",
        className: "text-xl font-bold text-neutral-600 dark:text-white",
        children: "Make things float in air"
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LandingCard);

/***/ })

}]);