"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue2Dropzone = _interopRequireDefault(require("vue2-dropzone"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var BaseUpload = {
  components: {
    Dropzone: _vue2Dropzone["default"]
  },
  props: {
    url: {
      type: String,
      required: true
    },
    collection: {
      type: String,
      required: true
    },
    maxNumberOfFiles: {
      type: Number,
      required: false,
      "default": 1
    },
    maxFileSizeInMb: {
      type: Number,
      required: false,
      "default": 2
    },
    acceptedFileTypes: {
      type: String,
      required: false
    },
    thumbnailWidth: {
      type: Number,
      required: false,
      "default": 200
    },
    uploadedImages: {
      type: Array,
      required: false,
      "default": function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      mutableUploadedImages: this.uploadedImages,
      headers: {
        "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').getAttribute("content")
      }
    };
  },
  template: "<dropzone :id=\"collection\" \n                       :url=\"url\" \n                       v-bind:preview-template=\"template\"\n                       v-on:vdropzone-success=\"onSuccess\"\n                       v-on:vdropzone-error=\"onUploadError\"\n                       v-on:vdropzone-removed-file=\"onFileDelete\"\n                       v-on:vdropzone-file-added=\"onFileAdded\"\n                       :useFontAwesome=\"true\" \n                       :ref=\"collection\"\n                       :maxNumberOfFiles=\"maxNumberOfFiles\"\n                       :maxFileSizeInMB=\"maxFileSizeInMb\"\n                       :acceptedFileTypes=\"acceptedFileTypes\"\n                       :thumbnailWidth=\"thumbnailWidth\"\n                       :headers=\"headers\">\n                \n                <input type=\"hidden\" name=\"collection\" :value=\"collection\">\n            </dropzone>",
  mounted: function mounted() {
    this.attachAlreadyUploadedMedia();
  },
  methods: {
    onSuccess: function onSuccess(file, response) {
      if (!file.type.includes("image")) {
        setTimeout(function () {
          //FIXME jquery
          $(file.previewElement).removeClass("dz-file-preview");
        }, 3000);
      }
    },
    onUploadError: function onUploadError(file, error) {
      var errorMessage = typeof error == "string" ? error : error.message;
      this.$notify({
        type: "error",
        title: "Error!",
        text: errorMessage
      });
      $(file.previewElement).find(".dz-error-message span").text(errorMessage);
    },
    onFileAdded: function onFileAdded(file) {
      this.placeIcon(file);
    },
    onFileDelete: function onFileDelete(file, error, xhr) {
      var deletedFileIndex = this.mutableUploadedImages.findIndex(function (o) {
        return o.url === file.url;
      });

      if (this.mutableUploadedImages[deletedFileIndex]) {
        this.mutableUploadedImages[deletedFileIndex]["deleted"] = true; //dontSubstractMaxFiles fix

        var currentMax = this.$refs[this.collection].dropzone.options.maxFiles;
        this.$refs[this.collection].setOption("maxFiles", currentMax + 1);
      }
    },
    attachAlreadyUploadedMedia: function attachAlreadyUploadedMedia() {
      var _this = this;

      this.$nextTick(function () {
        if (_this.mutableUploadedImages) {
          for (var _i = 0, _Object$entries = Object.entries(_this.mutableUploadedImages); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                key = _Object$entries$_i[0],
                file = _Object$entries$_i[1];

            _this.$refs[_this.collection].manuallyAddFile({
              name: file["name"],
              size: file["size"],
              type: file["type"],
              url: file["url"]
            }, file["thumb_url"], false, false, {
              dontSubstractMaxFiles: false,
              addToFiles: true
            });
          }
        }
      });
    },
    getFiles: function getFiles() {
      var files = [];

      for (var _i2 = 0, _Object$entries2 = Object.entries(this.mutableUploadedImages); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            file = _Object$entries2$_i[1];

        if (file.deleted) {
          files.push({
            id: file.id,
            collection_name: this.collection,
            action: "delete"
          });
        }
      }

      for (var _i3 = 0, _Object$entries3 = Object.entries(this.$refs[this.collection].getAcceptedFiles()); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            _key = _Object$entries3$_i[0],
            _file = _Object$entries3$_i[1];

        var response = JSON.parse(_file.xhr.response);

        if (response.path) {
          files.push({
            id: _file.id,
            collection_name: this.collection,
            path: response.path,
            action: _file.deleted ? "delete" : "add",
            //TODO: update ie. meta_data.name
            meta_data: {
              name: _file.name,
              //TODO: editable in the future
              file_name: _file.name,
              width: _file.width,
              height: _file.height
            }
          });
        }
      }

      return files;
    },
    placeIcon: function placeIcon(file) {
      //FIXME cele to je jqueryoidne, asi si budeme musiet spravit vlastny vue wrapper, tento je zbugovany
      var $previewElement = $(file.previewElement);

      if (file.url) {
        $previewElement.find(".dz-filename").html('<a href="' + file.url + '" target="_BLANK" class="dz-btn dz-custom-download">' + file.name + "</a>");
      }

      if (file.type.includes("image")) {//nothing, default thumb
      } else if (file.type.includes("pdf")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-pdf-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("word")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-word-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("spreadsheet") || file.type.includes("csv")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-excel-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("presentation")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-powerpoint-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("video")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-video-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("text")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-text-o"></i><p>' + file.name + "</p>");
      } else if (file.type.includes("zip") || file.type.includes("rar")) {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-archive-o"></i><p>' + file.name + "</p>");
      } else {
        $previewElement.find(".dz-image").html('<i class="fa fa-file-o"></i><p>' + file.name + "</p>");
      }
    },
    template: function template() {
      return "\n              <div class=\"dz-preview dz-file-preview\">\n                  <div class=\"dz-image\">\n                      <img data-dz-thumbnail />\n                  </div>\n                  <div class=\"dz-details\">\n                    <div class=\"dz-size\"><span data-dz-size></span></div>\n                    <div class=\"dz-filename\"></div>\n                  </div>\n                  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n                  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n                  <div class=\"dz-success-mark\"><i class=\"fa fa-check\"></i></div>\n                  <div class=\"dz-error-mark\"><i class=\"fa fa-close\"></i></div>\n              </div>\n          ";
    }
  }
};
var _default2 = BaseUpload;
exports["default"] = _default2;