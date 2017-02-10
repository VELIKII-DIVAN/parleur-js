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

  // Builds a function which takes a parser, and asserts that it has no more text to parse.
  module.end = function (parser) {
    if (parser.failure()) return undefined;

    if (parser.current() === "") {
      return;
    }
    
    parser.fail("Expected end of text but got " + parser.excerpt());
    return undefined;
  }

  // Asserts that there is no more text to parse.
  module.Parser.prototype.end = function () {
    return module.end(this);
  }

  // Builds a function which takes a parser, and parses and returns the given string.
  module.string = function (string) {
    return function (parser) {
      if (parser.failure()) return;

      if (parser.current().startsWith(string)) {
        parser.position += string.length;
        return string;
      }

      parser.fail("Expected '" + string + "' but got " + parser.excerpt());

      return undefined;
    }
  }

  // Parses and returns the given string.
  module.Parser.prototype.string = function (string) {
    return module.string(string)(this);
  };

  // Builds a function which takes a parser, and parses and returns a match
  // for the given regular expression pattern.
  module.regex = function (pattern) {
    return function (parser) {
      if (parser.failure()) return undefined;

      if (!pattern.startsWith("^")) {
        pattern = "^" + pattern;
      }

      var regex = new RegExp(pattern);
      var current = parser.current();
      var matches = regex.exec(current);

      if (matches == null) {
        parser.fail("Expected a match for the regular expression '" + pattern + "' but got " + parser.excerpt());
        return undefined;
      }

      var match = matches[0];
      parser.position += match.length;

      return match;
    }
  }

  // Parses and returns a match for the given regular expression pattern.
  module.Parser.prototype.regex = function (pattern) {
    return module.regex(pattern)(this);
  }

  // Parses an integer, either positive or negative.
  module.integer = function (parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("-?(0|[1-9][0-9]*)");

    if (parser.success()) {
      return parseInt(valueString);
    }

    parser.refail("Expected an integer but got " + parser.excerpt());
    return undefined;
  }

  // Parses an integer, either positive or negative.
  module.Parser.prototype.integer = function (parser) {
    return module.integer(this);
  }

  // Parses a float, either positive or nigtave, posiibly with an exponent.
  module.float = function (parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("-?(0|[1-9][0-9]*)(\\.[0-9]+)?(e(0|[1-9][0-9]+))?");

    if (parser.success()) {
      return parseFloat(valueString);
    }

    parser.refail("Expected a float but got " + parser.excerpt());
    return undefined;
  }

  // Parses a float, either positive or nigtave, posiibly with an exponent.
  module.Parser.prototype.float = function () {
    return module.float(this);
  }

  // Builds a function which takes a parser, and parses one of 
  // several possibilities returning the result of the first rule 
  // to succeed. If none of the possibilities succeed the error
  // message of the rule which consumed the most text is used.
  module.oneOf = function (possibilities) {
    return function (parser) {
      if (parser.failure()) return undefined;

      var topError = undefined;

      for (var i = 0; i < possibilities.length; i++) {
        var rule = possibilities[i];
        
        var result = rule(parser);

        if (parser.success()) {
          return result;
        }

        if (topError == undefined || parser.error.position > topError.position) {
          topError = parser.error;
        }

        parser.error = undefined;
      }

      parser.error = topError;
      parser.fail("Error while in `oneOf` (use `refail` to add a more appropriate error message)");
      return undefined;
    }
  }

  // Parses one of several possibilities returning the result of the 
  // first rule to succeed. If none of the possibilities succeed the
  // error message of the rule which consumed the most text is used.
  module.Parser.prototype.oneOf = function (possibilities) {
    return module.oneOf(possibilities)(this);
  }

  return module;
}
)();
