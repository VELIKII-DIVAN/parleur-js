function optionalPositiveTest() {
  var expected = "foo";
  var parser = new Parleur.Parser(expected);
  var result = parser.optional(Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");

  expected = undefined;
  parser = new Parleur.Parser("");;
  result = parser.optional(Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success(), "parser success");
  assertEquals(result, expected, "result");
}
