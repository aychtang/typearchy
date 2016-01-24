var typearchy  = require("./index");
var movingbody = require("movingbody");

var heading1      = document.querySelector("h1");
var heading2      = document.querySelector("h2");
var heading3      = document.querySelector("h3");
var paragraphs    = document.querySelectorAll("p");
var previousWidth = paragraphs[0].clientWidth + 1;

var resize = function () {
  var width = paragraphs[0].clientWidth;

  if (width !== previousWidth)
  {
    var pointSize = movingbody.getNiceSize( "Georgia"
                                          , width
                                          , paragraphs[1].textContent
                                          , 72 );
    var typeSizes = typearchy(pointSize);

    Array.prototype.slice.call(paragraphs)
      .forEach(function(p) { p.style.fontSize = typeSizes.body });

    heading1.style.fontSize = typeSizes.title;
    heading2.style.fontSize = typeSizes.h1;
    heading3.style.fontSize = typeSizes.h2;

    previousWidth = width;
  }

  window.requestAnimationFrame(resize);
};

window.requestAnimationFrame(resize);
