function manyPositiveTest() {
  
}

var assert = require('assert');
var Parleur = require("../src/index.js");

describe('many', function() {
  it('should parse three foo', function() {
    var expected = ["foo", "foo", "foo"];
    var parser = new Parleur.Parser("foofoofoo");
    var result = parser.many(Parleur.string("foo"));
    parser.end();
    assert(parser.success());
    assert.equal(result.length, expected.length);

    for (var i = 0; i < result.length; i++) {
      assert.equal(result[i], expected[i]);
    }
  });

  it('should succeed on no elements', function() {
    var parser = new Parleur.Parser("");
    parser.many(Parleur.int);
    parser.end();
    assert(parser.success());
  });

  it('should backtrack', function() {
    var parser = new Parleur.Parser("   adsf");
    var results = parser.many(Parleur.chain([Parleur.whitespace, Parleur.int]));
    assert(parser.success());
    assert.equal(parser.position, 0);
  });
});