function oneOfPositiveTest() {
  var expected = 42;
  var parser = new SimpleParser.Parser("42");
  var result = parser.oneOf([SimpleParser.string("foo"), SimpleParser.int]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  expected = "foo";
  parser = new SimpleParser.Parser(expected);
  result = parser.oneOf([SimpleParser.string("foo"), SimpleParser.int]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}

function oneOfNegativeTest() {
  var parser = new SimpleParser.Parser("bar");
  var result = parser.oneOf([SimpleParser.string("foo"), SimpleParser.int]);
  parser.end();
  assertFalse(parser.success());
}
