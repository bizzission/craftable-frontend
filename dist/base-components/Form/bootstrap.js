"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _jquery = _interopRequireDefault(require("jquery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This file is here only to ensure backwards compatibility
window.$ = window.jQuery = _jquery["default"];
window.Vue = _vue["default"];
var token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': token.content
    }
  });
}