function delimitedPositiveTest() {
  var parser = new SimpleParser.Parser("(42)");
  var result = parser.delimited("(", ")", SimpleParser.int);
  parser.end();

  assertEquals(result, 42);
  assertTrue(parser.success());
}

function delimitedNegativeTest() {
  var parser = new SimpleParser.Parser("42");
  var result = parser.delimited("(", ")", SimpleParser.int);
  parser.end();

  assertFalse(parser.success());
}
