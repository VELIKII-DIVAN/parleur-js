function failTest() {
  var parser = new Parleur.Parser("");

  parser.fail("This is a failure");
  assertTrue(parser.failure());
  assertFalse(parser.success());
}
