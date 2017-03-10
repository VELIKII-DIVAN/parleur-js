function digitPositiveTest() {
    var expected = "1"
    var parser = new SimpleParser.Parser(expected);
    var result = parser.digit();
    parser.end();
    assertTrue(parser.success(), "parser success");
    assertEquals(result, expected, "result");
}

function digitNegativeTest() {
    var parser = new SimpleParser.Parser("");
    var result = parser.digit();
    parser.end();
    assertFalse(parser.success(), "parser success");

    parser = new SimpleParser.Parser("a");
    result = parser.digit();
    parser.end();
    assertFalse(parser.success(), "parser success");
}

