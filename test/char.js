function charPositiveTest() {
  var expected = "a"
  var parser = new Parleur.Parser(expected);
  var result = parser.char();
  parser.end();

  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}

function charNegativeTest() {
  var parser = new Parleur.Parser("");
  var result = parser.char();
  parser.end();

  assertFalse(parser.success(), "parser success");
}
