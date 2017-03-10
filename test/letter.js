function letterPositiveTest() {
  var expected = "a"
  var parser = new SimpleParser.Parser(expected);
  var result = parser.letter();
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}

function letterNegativeTest() {
  var parser = new SimpleParser.Parser("");
  var result = parser.letter();
  parser.end();
  assertFalse(parser.success(), "parser success");

  parser = new SimpleParser.Parser("4");
  result = parser.letter();
  parser.end();
  assertFalse(parser.success(), "parser success");
}
