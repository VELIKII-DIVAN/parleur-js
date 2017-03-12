function spacePositiveTest() {
  var expected = "     ";
  var parser = new Parleur.Parser(expected);

  var result = parser.space();
  parser.end();

  assertTrue(parser.success());
  assertEquals(result, expected);
}

function spaceNegativeTest() {
  var parser = new Parleur.Parser("foo");

  var result = parser.space();
  parser.end();

  assertFalse(parser.success());
}
