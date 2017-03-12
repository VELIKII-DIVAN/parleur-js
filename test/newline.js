function newlinePositiveTest() {
  var expected = "\n\n\r\n";
  var parser = new Parleur.Parser(expected);

  var result = parser.newline();
  parser.end();

  assertTrue(parser.success());
  assertEquals(result, expected);
}

function newlineNegativeTest() {
  var parser = new Parleur.Parser("foo");

  var result = parser.newline();
  parser.end();

  assertFalse(parser.success());
}
