function whitespacePositiveTest() {
  var expected = "     \r\n\t";
  var parser = new Parleur.Parser(expected);
  var result = parser.whitespace();
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}

function whitespaceNegativeTest() {
  var parser = new Parleur.Parser("foo");
  var result = parser.whitespace();
  parser.end();
  assertFalse(parser.success());
}
