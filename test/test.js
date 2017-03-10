// Runs a test function and writes the ouput to the console and the
// document.
function runTest(name, testFunction) {
  document.write(name + ": ");
  try {
    testFunction();
    document.write("<span class='success'>passed");
  }
  catch(err) {
    document.write("<span class='failure'>failed: " + err);
  }

  document.write("</span><br/>");
}

// Asserts that 'b' is true.
function assertTrue(b, message) {
  if (b) {
    return;
  }
  
  message = message ? " (" + message + ")" : "";
  throw "Assertion error: expected true" + message;
}

// Asserts that 'b' is false.
function assertFalse(b, message) {
  if (!b) {
    return;
  }
  
  message = message ? " (" + message + ")" : "";
  throw "Assertion error: expected false" + message;
}

// Asserts that 'a' equals 'b'.
function assertEquals(a, b, message) {
  if (a === b) {
    return;
  }
 
  message = message ? " (" + message + ")" : "";
  throw "Assertion error: " + a + " != " + b + message;
}
