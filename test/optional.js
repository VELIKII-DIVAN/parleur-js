var assert = require('assert');
var Parleur = require("../src/index.js");

describe('optional', function() {
  it('should parse foo', function() {
    var parser = new Parleur.Parser("foo");
    var result = parser.optional(Parleur.string("foo"));
    parser.end();
    assert(parser.success());
    assert.equal(result, "foo");
  });

  it('should not fail', function() {
    var parser = new Parleur.Parser('');
    var result = parser.optional(Parleur.string("foo"));
    parser.end();
    assert(parser.success());
    assert.equal(result, undefined);
  });

  it('should backtrack', function() {
    var parser = new Parleur.Parser('   adsf');
    var results = parser.optional(Parleur.chain([Parleur.whitespace, Parleur.int]));
    assert(parser.success());
    assert.equal(parser.position, 0);
  });
});
