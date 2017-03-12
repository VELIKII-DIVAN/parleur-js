function stringPositiveTest() {
  var expected = "foo";
  var parser = new Parleur.Parser(expected);

  var result = parser.string(expected);
  parser.end();

  assertTrue(parser.success());
  assertEquals(result, expected);
}

function stringNegativeTest() {
  var expected = "foo";
  var parser = new Parleur.Parser("bar");

  var result = parser.string(expected);
  parser.end();

  assertTrue(parser.failure());
}
