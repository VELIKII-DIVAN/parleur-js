// Runs a test function and writes the ouput to the console and the
// document.
function runPositiveTest(name, testFunction) {
  document.write(name + ": ");
  try {
    testFunction();
    document.write("success");
  }
  catch(err) {
    document.write("failure: " + err);
  }

  document.write("<br/>");
}

// Runs a test function and writes the ouput to the console and the
// document.
function runNegativeTest(name, testFunction) {
  document.write(name + ": ");
  try {
    testFunction();
    document.write("failure (test was successful)");
  }
  catch(err) {
    document.write("success");
  }

  document.write("<br/>");
}

function assert(b, message) {
  if (b) {
    return;
  }
  
  throw "Assertion error: " + message;
}
