function refailTest() {
  var parser = new Parleur.Parser("");
  parser.fail("fail");
  parser.refail("refail");
  assertEquals(parser.error.message, "refail");
  assertEquals(parser.error.position, 0);
  assertEquals(parser.error.innerError, undefined);
}
