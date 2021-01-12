"use strict";

require("popper.js");

require("@coreui/coreui");

$(function () {
  // spinner buttons
  $(".btn-spinner").on("click", function (e) {
    if (!(e.shiftKey || e.ctrlKey || e.metaKey)) {
      $(this).css({ "pointer-events": "none" });
      $(this).find("i").removeClass().addClass("fa fa-spinner");
    }
  });

  // remove empty nav titles when no children there
  $(".nav-title").filter(function () {
    return !$(this).next().hasClass("nav-item");
  }).hide();
});