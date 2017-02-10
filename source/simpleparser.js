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

  // Signals that a parser error has occured, chaining the new error.
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

  // Replaces the message of the topmost error.
  module.Parser.prototype.refail = function (message) {
    if (this.error == undefined) {
      return;
    }
    else {
      this.error.message = message;
      this.error.innerError = undefined;
    }
  }

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

    if (current.length == 0) {
      return "end of text";
    }

    if (current.length < this.excerptLength) {
      return "'" + current + "'";
    }

    return "'" + current.substr(0, this.excerptLength) + " ...'";
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
    
    this.fail("Expected end of text but got " + this.excerpt());
    return undefined;
  }

  // Parses and returns the given string.
  module.Parser.prototype.string = function (string) {
    if (this.failure()) return;

    if (this.current().startsWith(string)) {
      this.position += string.length;
      return string;
    }

    this.fail("Expected '" + string + "' but got " + this.excerpt());

    return undefined;
  };

  // Parses and returns a match for the given regular expression pattern.
  module.Parser.prototype.regex = function (pattern) {
    if (this.failure()) return undefined;

    if (!pattern.startsWith("^")) {
      pattern = "^" + pattern;
    }

    var regex = new RegExp(pattern);
    var current = this.current();
    var matches = regex.exec(current);

    if (matches == null) {
      this.fail("Expected a match for the regular expression '" + pattern + "' but got " + this.excerpt());
      return undefined;
    }

    var match = matches[0];
    this.position += match.length;

    return match;
  }

  // Parses an integer, either positive or negative.
  module.Parser.prototype.integer = function () {
    if (this.failure()) return undefined;

    var valueString = this.regex("-?(0|[1-9][0-9]*)");

    if (this.success()) {
      return parseInt(valueString);
    }

    this.refail("Expected an integer but got " + this.excerpt());
    return undefined;
  }

  // Parses a float, either positive or nigtave, posiibly with an exponent.
  module.Parser.prototype.float = function () {
    if (this.failure()) return undefined;

    var valueString = this.regex("-?(0|[1-9][0-9]*)(\\.[0-9]+)?(e(0|[1-9][0-9]+))?");

    if (this.success()) {
      return parseFloat(valueString);
    }

    this.refail("Expected a float but got " + this.excerpt());
    return undefined;
  }

  // Parses one of several possibilities returning the result of the first
  // one to succeed. If none of the possibilities succeed the error message of
  // the rule which consumed the most text is used.
  module.Parser.prototype.oneOf = function (possibilities) {
    if (this.failure()) return undefined;

    var topError = undefined;

    for (var i = 0; i < possibilities.length; i++) {
      var rule = possibilities[i];
      
      var result = rule(this);

      if (this.success()) {
        return result;
      }

      if (topError == undefined || this.error.position > topError.position) {
        topError = this.error;
      }

      this.error = undefined;
    }

    this.error = topError;
    this.fail("Error while in `oneOf` (use `refail` to add a more appropriate error message)");
    return undefined; 
  }

  return module;
}
)();
