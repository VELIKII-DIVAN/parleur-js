function spacePositiveTest() {
  var expected = "     ";
  var parser = new SimpleParser.Parser(expected);

  var result = parser.space();
  parser.end();

  assertTrue(parser.success());
  assertEquals(result, expected);
}

function spaceNegativeTest() {
  var parser = new SimpleParser.Parser("foo");

  var result = parser.space();
  parser.end();

  assertFalse(parser.success());
}
