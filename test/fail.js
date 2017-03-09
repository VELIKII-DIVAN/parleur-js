function failTest() {
  var parser = new SimpleParser.Parser("");

  parser.fail("This is a failure");
  assertTrue(parser.failure());
  assertFalse(parser.success());
}
