module.exports = function (s) {
  var h1 = Math.ceil(s + (s / 3));
  var h2 = (h1 - s) / 2 + s;

  return { h1    : h1
         , h2    : h2
         , body  : s
         , title : Math.ceil(s + (s / 2))
         };
};
