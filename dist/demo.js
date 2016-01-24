(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var st         = require("sizetables");
var tableCache = {};

var generateTable = function (font, size) {
  return st.calculateSizeTable( size + "px " + font, st.defaultCharSet() );
};

// Also ensures there is a table added in cache if required.
var getTable = function (font, size) {
  if (!tableCache[font])
    tableCache[font] = {};

  if (!tableCache[font][size])
    tableCache[font][size] = generateTable(font, size);

  return tableCache[font][size];
};

var getFirstLine = function(table, text, width) {
  var words   = text.split(" ");
  var current = "";
  while (st.measureText(current, table) < width && words.length)
    current += (words.shift() + " ");
  return current;
};

// Find a nice font size for a text given a containing width.
var getNiceSize = function (font, width, text, size) {
  var line = getFirstLine(getTable(font, size), text, width);
  if (line.length > 60 && line.length < 75) return size;
  if (text.length < 10)                     return size;
  if (size < 11 || size > 72) return size;
  return getNiceSize(font, width, text, line.length > 75 ? size + 0.5 : size - 0.5);
};

exports.getNiceSize = getNiceSize;

},{"sizetables":2}],2:[function(require,module,exports){
// Range covers most characters required for standard english text.
var defaultCharSet = function () {
  var set = [];
  for (var i = 48; i < 177; i++)
    set.push(String.fromCharCode(i));
  return set;
};

// Generation - depends on DOM + canvas measurement to produce a sizetable.

var measureChar = (function () {
  var canvas  = document.createElement("canvas");
  var context = canvas.getContext("2d");

  return function (f, c) {
    context.font = f;
    return context.measureText(c).width;
  };
}());

var calculateSizeTable = function (font, charSet) {
  var table = {};
  charSet.forEach(function (c) { table[c] = measureChar(font, c); });
  return table;
};

// Measurements - done purely outside of DOM with supplied sizetable.

var measureText = function (text, sizeTable) {
  var collectSizes = function (a, c) { return a + (sizeTable[c] || 8); };
  return text.split("").reduce(collectSizes, 0);
};

exports.measureText        = measureText;
exports.measureChar        = measureChar;
exports.defaultCharSet     = defaultCharSet;
exports.calculateSizeTable = calculateSizeTable;

},{}],3:[function(require,module,exports){
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

},{"./index":4,"movingbody":1}],4:[function(require,module,exports){
module.exports = function (s) {
  var h1 = Math.ceil(s + (s / 3));
  var h2 = (h1 - s) / 2 + s;

  return { h1    : h1
         , h2    : h2
         , body  : s
         , title : Math.ceil(s + (s / 2))
         };
};

},{}]},{},[3]);
