function separatedPositiveTest() {
  var expected = ["foo", "foo", "foo"];
  var parser = new SimpleParser.Parser("foo, foo   , foo");
  var result = parser.separated(",", 0, SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, expected.length, "expected no. of results");

  for (var i = 0; i < result.length; i++) {
    assertEquals(result[i], expected[i]);
  }

  parser = new SimpleParser.Parser("");
  result = parser.separated(",", 0, SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, 0, "expected no. of results");

  parser = new SimpleParser.Parser("foo");
  result = parser.separated(",", 0, SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, 1, "expected no. of results");
}

function separatedNegativeTest() {
  var parser = new SimpleParser.Parser("foo, foo   , foo");
  var result = parser.separated(",", 4, SimpleParser.string("foo"));
  parser.end();
  assertFalse(parser.success());

  var parser = new SimpleParser.Parser("foo, foo   , bar");
  var result = parser.separated(",", 0, SimpleParser.string("foo"));
  parser.end();
  assertFalse(parser.success());
}
