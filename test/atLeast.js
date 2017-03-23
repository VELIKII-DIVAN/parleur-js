var assert = require('assert');
var Parleur = require("../src/index.js");

describe('atLeast', function() {
  it('should parse at least one integer', function() {
    var expected = 42;
    var parser = new Parleur.Parser("42");
    var result = parser.atLeast(1, Parleur.int);
    parser.end();
    assert(parser.success());
    assert.equal(result, expected);
  });

  it('should fail on no elements', function() {
    var parser = new Parleur.Parser("  oboy");
    parser.atLeast(2, Parleur.int);
    parser.end();
    assert(parser.failure());
  });
});