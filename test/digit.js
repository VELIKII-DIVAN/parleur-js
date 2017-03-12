function digitPositiveTest() {
    var expected = "1"
    var parser = new Parleur.Parser(expected);
    var result = parser.digit();
    parser.end();
    assertTrue(parser.success(), "parser success");
    assertEquals(result, expected, "result");
}

function digitNegativeTest() {
    var parser = new Parleur.Parser("");
    var result = parser.digit();
    parser.end();
    assertFalse(parser.success(), "parser success");

    parser = new Parleur.Parser("a");
    result = parser.digit();
    parser.end();
    assertFalse(parser.success(), "parser success");
}

