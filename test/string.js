function stringPositiveTest() {
  var expected = "foo";
  var parser = new SimpleParser.Parser(expected);

  var result = parser.string(expected);
  parser.end();

  assertTrue(parser.success());
  assertEquals(result, expected);
}

function stringNegativeTest() {
  var expected = "foo";
  var parser = new SimpleParser.Parser("bar");

  var result = parser.string(expected);
  parser.end();

  assertTrue(parser.failure());
}
