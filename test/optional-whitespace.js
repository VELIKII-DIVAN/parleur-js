function optionalWhitespacePositiveTest() {
  var expected = "     \r\n\t";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.optionalWhitespace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  var expected = "";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.optionalWhitespace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}
