function manyPositiveTest() {
  var expected = ["foo", "foo", "foo"];
  var parser = new Parleur.Parser("foofoofoo");
  var result = parser.many(Parleur.string("foo"));
  parser.end();
  assertTrue(parser.success());
  assertEquals(result.length, expected.length);

  for (var i = 0; i < result.length; i++) {
    assertEquals(result[i], expected[i]);
  }
}
