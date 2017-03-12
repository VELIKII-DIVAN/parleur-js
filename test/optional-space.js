function optionalSpacePositiveTest() {
  var expected = "     ";
  var parser = new Parleur.Parser(expected);
  var result = parser.optionalSpace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  var expected = "";
  var parser = new Parleur.Parser(expected);
  var result = parser.optionalSpace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}
