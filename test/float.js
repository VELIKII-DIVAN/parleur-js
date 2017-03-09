function floatPositiveTest() {
  var expected = 42.42;
  var parser = new SimpleParser.Parser("42.42");
  var result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = -42.42;
  parser = new SimpleParser.Parser("-42.42");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 0;
  parser = new SimpleParser.Parser("0.0000000");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 42.42e2;
  parser = new SimpleParser.Parser("42.42e2");
  result = parser.float();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());
}

function floatNegativeTest() {
  var parser = new SimpleParser.Parser("foo");
  var result = parser.float();
  parser.end();
  assertTrue(parser.failure());
}
