var SimpleParser = (function() {
  var module = {};

  module.Parser = function (text) {
    this.text = text;
    this.position = 0;
    this.error = undefined;
    this.excerptLength = 12;
  };

  // Returns true if no parser error has occured, false otherwise.
  module.Parser.prototype.success = function () {
    return this.error == undefined;
  };

  // Returns true if a parser error has occured, false otherwise.
  module.Parser.prototype.failure = function () {
    return this.error != undefined;
  };

  // Signals that a parser error has occured.
  module.Parser.prototype.fail = function (message) {
    if (this.error == undefined) {
      this.error = {
        message: message,
        position: this.position,
        innerError: undefined
      };
    }
    else {
      this.error = {
        message: message,
        position: this.position,
        innerError: this.error
      };
    }
  };

  // Assmbles and returns a message from the current error.
  module.Parser.prototype.errorMessage = function () {
    var message = "";
    var error = this.error;

    while (true) {
      message += error.message;
      
      if (error.innerError == undefined) {
        message += " (column " + error.position + ")";
        break;
      }
      else {
        message += ":\n";
        error = error.innerError;
      }
    }

    return message;
  }

  // Gets an excerpt of the text at the current position for building
  // error messages.
  module.Parser.prototype.excerpt = function () {
    var current = this.current();

    if (current.length < this.excerptLength) {
      return current;
    }

    return current.substr(0, this.excerptLength) + " ...";
  };

  // Returns the text to parse, starting from the current position.
  module.Parser.prototype.current = function () {
    return this.text.substr(this.position);
  };

  // Asserts that there is no more text to parse.
  module.Parser.prototype.end = function () {
    if (this.failure()) return undefined;

    if (this.current() === "") {
      return;
    }
    
    this.fail("Expected end of text but got '" + this.excerpt() + "'");
    return undefined;
  }

  // Parses the given string and returns it.
  module.Parser.prototype.string = function (string) {
    if (this.failure()) return;

    if (this.current().startsWith(string)) {
      this.position += string.length;
      return string;
    }

    this.fail("Expected '" + string + "' but got '" + this.excerpt() + "'");

    return undefined;
  };

  module.Parser.prototype.regex = function (pattern) {
    if (this.failure()) return undefined;

    if (!pattern.startsWith("^")) {
      pattern = "^" + pattern;
    }

    var regex = new RegExp(pattern);
    var current = this.current();
    var matches = regex.exec(current);

    if (matches == null) {
      this.fail("Expected a match for the regular expression '" + pattern + "' but got '" + this.excerpt() + "'");
      return undefined;
    }

    var match = matches[0];
    this.position += match.length;

    return match;
  }

  return module;
}
)();
