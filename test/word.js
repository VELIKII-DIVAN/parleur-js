function wordPositiveTest() {
  var expected = "foo";
  var parser = new Parleur.Parser(expected);
  var result = parser.word();;
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}

function wordNegativeTest() {
  var parser = new Parleur.Parser("");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");

  parser = new Parleur.Parser("42");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");

  parser = new Parleur.Parser("!");
  parser.word();;
  parser.end();
  assertFalse(parser.success(), "parser success");
}
