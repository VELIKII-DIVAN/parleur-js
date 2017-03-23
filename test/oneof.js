var assert = require('assert');
var Parleur = require("../src/index.js");

describe('oneOf', function() {
  it('should parse an integer', function() {
    var expected = 42;
    var parser = new Parleur.Parser("42");
    var result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
    parser.end();
    assert(parser.success());
    assert.equal(result, expected);
  });
});