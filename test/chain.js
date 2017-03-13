function chainPositiveTest() {
  var parser = new Parleur.Parser("foobar");
  var results = parser.chain([Parleur.string("foo"), Parleur.string("bar")]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(results[0], "foo");
  assertEquals(results[1], "bar");
}

function chainNegativeTest() {
  var parser = new Parleur.Parser("foo");
  var results = parser.chain([Parleur.string("foo"), Parleur.string("bar")]);
  parser.end();
  assertFalse(parser.success());
}
