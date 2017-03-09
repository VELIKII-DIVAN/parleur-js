function endPositiveTest() {
  var parser = new SimpleParser.Parser("");
  parser.end();
  assertTrue(parser.success());
}

function endNegativeTest() {
  var parser = new SimpleParser.Parser("foo");
  parser.end();
  assertFalse(parser.success());
}
