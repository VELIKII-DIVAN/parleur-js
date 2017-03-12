function regexPositiveTest() {
  var expected = "fooooooo";
  var parser = new Parleur.Parser(expected);
  var result = parser.regex("fo+");
  assertEquals(result, expected);
  assertTrue(parser.success());
}

function regexNegativeTest() {
  var parser = new Parleur.Parser("baaaaaaaaaaar");
  var result = parser.regex("fo+");
  assertFalse(parser.success());
}
