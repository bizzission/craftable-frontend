"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _BaseForm = _interopRequireDefault(require("../base-components/Form/BaseForm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].component('translation-form', {
  mixins: [_BaseForm["default"]]
});