function endPositiveTest() {
  var parser = new Parleur.Parser("");
  parser.end();
  assertTrue(parser.success());
}

function endNegativeTest() {
  var parser = new Parleur.Parser("foo");
  parser.end();
  assertFalse(parser.success());
}
