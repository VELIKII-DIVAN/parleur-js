var assert = require('assert');
var Parleur = require("../src/index.js");

describe('oneOf', function() {
    it('should parse an integer', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
      var expected = 42;
      var parser = new Parleur.Parser("42");
      var result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
      parser.end();
      assert(parser.success());
      assert.equal(result, expected);
    });
});

function oneOfPositiveTest() {
  

  expected = "foo";
  parser = new Parleur.Parser(expected);
  result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}

function oneOfNegativeTest() {
  var parser = new Parleur.Parser("bar");
  var result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
  parser.end();
  assertFalse(parser.success());
}
