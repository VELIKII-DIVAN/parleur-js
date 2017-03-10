function wordPositiveTest() {
  var expected = "foo";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.word();;
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}

function wordNegativeTest() {
  var parser = new SimpleParser.Parser("");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");

  parser = new SimpleParser.Parser("42");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");

  parser = new SimpleParser.Parser("!");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");
}
