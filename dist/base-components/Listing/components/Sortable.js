"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var Sortable = {
  props: {
    'column': {
      type: String,
      required: true
    },
    'orderBy': {
      type: Object,
      "default": function _default() {
        return this.$parent.orderBy;
      }
    },
    'callback': {
      type: Function,
      "default": function _default() {
        return this.$parent.loadData();
      }
    }
  },
  methods: {
    sort: function sort(column) {
      if (this.orderBy.column == column) {
        this.orderBy.direction = this.orderBy.direction == 'asc' ? 'desc' : 'asc';
      } else {
        this.orderBy.column = column;
        this.orderBy.direction = 'asc'; // I guess we do want to reset direction when changing column, but I'm not sure :)
      }

      this.callback(); // FIXME callback should have return a Promise which can success or end with an error
    }
  },
  template: '<th>' + '<a @click.stop="sort(column)"><span class="fa" :class="{\'fa-sort-amount-asc\': orderBy.column == column && orderBy.direction == \'asc\', \'fa-sort-amount-desc\': orderBy.column == column && orderBy.direction == \'desc\' }"></span> <slot></slot></a>' + '</th>'
};
var _default2 = Sortable;
exports["default"] = _default2;