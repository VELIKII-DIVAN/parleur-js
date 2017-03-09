function intPositiveTest() {
  var expected = 42;
  var parser = new SimpleParser.Parser("42");
  var result = parser.int();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = -42;
  parser = new SimpleParser.Parser("-42");
  result = parser.int();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());

  expected = 0;
  parser = new SimpleParser.Parser("0");
  result = parser.int();
  parser.end();
  assertEquals(result, expected);
  assertTrue(parser.success());
}

function intNegativeTest() {
  var parser = new SimpleParser.Parser("foo");
  var result = parser.int();
  parser.end();
  assertTrue(parser.failure());
}