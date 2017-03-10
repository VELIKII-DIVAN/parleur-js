function optionalPositiveTest() {
  var expected = "foo";
  var parser = new SimpleParser.Parser(expected);
  var result = parser.optional(SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");

  expected = undefined;
  parser = new SimpleParser.Parser("");;
  result = parser.optional(SimpleParser.string("foo"));
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}
