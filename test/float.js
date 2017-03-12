function floatPositiveTest() {
  var expected = 42.42;
  var parser = new Parleur.Parser("42.42");
  var result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = -42.42;
  parser = new Parleur.Parser("-42.42");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 0;
  parser = new Parleur.Parser("0.0000000");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 42.42e2;
  parser = new Parleur.Parser("42.42e2");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());
}

function floatNegativeTest() {
  var parser = new Parleur.Parser("foo");
  var result = parser.float();
  parser.end();
  assertTrue(parser.failure());
}
