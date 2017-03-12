function delimitedPositiveTest() {
  var parser = new Parleur.Parser("(42)");
  var result = parser.delimited("(", ")", Parleur.int);
  parser.end();

  assertEquals(result, 42);
  assertTrue(parser.success());
}

function delimitedNegativeTest() {
  var parser = new Parleur.Parser("42");
  var result = parser.delimited("(", ")", Parleur.int);
  parser.end();

  assertFalse(parser.success());
}
