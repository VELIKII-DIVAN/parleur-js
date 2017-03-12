function oneOfPositiveTest() {
  var expected = 42;
  var parser = new Parleur.Parser("42");
  var result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);

  expected = "foo";
  parser = new Parleur.Parser(expected);
  result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
  parser.end();
  assertTrue(parser.success());
  assertEquals(result, expected);
}

function oneOfNegativeTest() {
  var parser = new Parleur.Parser("bar");
  var result = parser.oneOf([Parleur.string("foo"), Parleur.int]);
  parser.end();
  assertFalse(parser.success());
}
