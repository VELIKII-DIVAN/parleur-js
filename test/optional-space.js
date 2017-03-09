function optionalSpacePositiveTest() {
  var expected = "     ";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.optionalSpace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  var expected = "";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.optionalSpace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}
