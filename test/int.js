function intPositiveTest() {
  var expected = 42;
  var parser = new Parleur.Parser("42");
  var result = parser.int();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 0;
  parser = new Parleur.Parser("0");
  result = parser.int();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());
}

function intNegativeTest() {
  var parser = new Parleur.Parser("foo");
  var result = parser.int();
  parser.end();
  assertTrue(parser.failure());

  parser = new Parleur.Parser("-42");
  result = parser.int();
  parser.end();
  assertTrue(parser.failure());
}
