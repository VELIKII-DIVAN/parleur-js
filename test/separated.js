function separatedPositiveTest() {
  var expected = ["foo", "foo", "foo"];
  var parser = new Parleur.Parser("foo,foo,foo");
  var result = parser.separated(Parleur.string(","), Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, expected.length, "expected no. of results");

  for (var i = 0; i < result.length; i++) {
    assertEquals(result[i], expected[i]);
  }

  parser = new Parleur.Parser("");
  var result = parser.separated(Parleur.string(","), Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, 0, "expected no. of results");

  parser = new Parleur.Parser("foo");
  var result = parser.separated(Parleur.string(","), Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, 1, "expected no. of results");
}
