function optionalWhitespacePositiveTest() {
  var expected = "     \r\n\t";
  var parser = new Parleur.Parser(expected);
  var result = parser.optionalWhitespace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  var expected = "";
  var parser = new Parleur.Parser(expected);
  var result = parser.optionalWhitespace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}
