// Runs a test function and writes the ouput to the console and the
// document.
function runTest(name, testFunction) {
  document.write(name + ": ");
  try {
    testFunction();
    document.write("<span class='success'>success");
  }
  catch(err) {
    document.write("<span class='failure'>failure: " + err);
  }

  document.write("</span><br/>");
}

// Asserts that 'b' is true.
function assertTrue(b) {
  if (b) {
    return;
  }
  
  throw "Assertion error: expected true";
}

// Asserts that 'b' is false.
function assertFalse(b) {
  if (!b) {
    return;
  }
  
  throw "Assertion error: expected false";
}

// Asserts that 'a' equals 'b'.
function assertEquals(a, b) {
  if (a === b) {
    return;
  }
  
  throw "Assertion error: " + a + " != " + b;
}
