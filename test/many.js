function manyPositiveTest() {
  var expected = ["foo", "foo", "foo"];
  var parser = new SimpleParser.Parser("foofoofoo");
  var result = parser.many(SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, expected.length);

  for (var i = 0; i < result.length; i++) {
    assertEquals(result[i], expected[i]);
  }
}

function manyNegativeTest() {
  var parser = new SimpleParser.Parser("bar");
  var result = parser.many(SimpleParser.string("foo"));
  parser.end();
  assertFalse(parser.success());

  var parser = new SimpleParser.Parser("foofoo");
  var result = parser.many(SimpleParser.string("foo"), 3);
  parser.end();
  assertFalse(parser.success());
}
