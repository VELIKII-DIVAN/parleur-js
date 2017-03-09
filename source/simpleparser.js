var SimpleParser = (function() {
  var module = {};

  // Builds a function which takes a parser, and asserts that it has no more 
  // text to parse.
  module.end = function(parser) {
    if (parser.failure()) return undefined;

    if (parser.current() === "") {
      return;
    }
    
    parser.fail("Expected end of text but got " + parser.excerpt());
    return undefined;
  }

  // Parses a float, either positive or nigtave, posiibly with an exponent.
  module.float = function(parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("-?(0|[1-9][0-9]*)(\\.[0-9]+)?(e(0|[1-9][0-9]+))?");

    if (parser.success()) {
      return parseFloat(valueString);
    }

    parser.refail("Expected a float but got " + parser.excerpt());
    return undefined;
  }

  // Parses an integer, either positive or negative.
  module.integer = function(parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("-?(0|[1-9][0-9]*)");

    if (parser.success()) {
      return parseInt(valueString);
    }

    parser.refail("Expected an integer but got " + parser.excerpt());
    return undefined;
  }

  // Builds a function which takes a parser and parses multiple instances of one
  // rule, with an optional required count.
  module.many = function (parserFunc, atLeast) {
    return function(parser) {
      if (parser.failure()) return undefined;
      var reuslts = [];

      while (true) {
        var result = parserFunc(parser);
        
        if (parser.failure()) {
          parser.failure = undefined;
          break;
        }

        results.push(result);
      }

      if (results.length < atLeast) {
        parser.fail("Error while in `multiple` expected at least " + atLeast + " instances " + "(use `refail` to add a more appropriate error message)");
      }

      return results;
    }
  }

  // Builds a function which takes a parser, and parses one of several
  // possibilities returning the result of the first rule to succeed. If none of
  // the possibilities succeed the error message of the rule which consumed the
  // most text is used.
  module.oneOf = function(possibilities) {
    return function(parser) {
      if (parser.failure()) return undefined;

      var topError = undefined;

      for (var i = 0; i < possibilities.length; i++) {
        var rule = possibilities[i];      
        var result = rule(parser);

        if (parser.success()) {
          return result;
        }

        var isNewTopError = parser.error.position > topError.position;

        if (topError == undefined || isNewTopError) {
          topError = parser.error;
        }

        parser.error = undefined;
      }

      parser.error = topError;
      parser.fail("Error while in `oneOf` (use `refail` to add a more appropriate error message)");
      return undefined;
    }
  }

  // Builds a function which takes a parser, and parses and returns a match for
  // the given regular expression pattern.
  module.regex = function(pattern) {
    return function(parser) {
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

  // Builds a function which takes a parser, and parses and returns the given
  // string.
  module.string = function(string) {
    return function(parser) {
      if (parser.failure()) return;

      if (parser.current().startsWith(string)) {
        parser.position += string.length;
        return string;
      }

      parser.fail("Expected '" + string + "' but got " + parser.excerpt());

      return undefined;
    }
  }

  // Parses one or more whitespace characters (space, tab, newline).
  module.whitespace = function(parser) {
    if (parser.failure()) return;

    parser.regex("( |\t|\n|\r)+");
    parser.refail(parser.expected("whitespace"));
  }

  // Parses one or more space characters.
  module.space = function(parser) {
    if (parser.failure()) return;

    parser.regex(" +");
    parser.refail(parser.expected("space"));
  }

  // Parses one or more newline characters.
  module.newline = function(parser) {
    if (parser.failure()) return;

    parser.regex("(\n|\r\n)+");
    parser.refail(parser.expected("space"));
  }

  // Constructor for Parser object, takes the text to parse.
  module.Parser = function(text) {
    this.text = text;
    this.position = 0;
    this.error = undefined;
    this.excerptLength = 12;
  };

  // Returns the text to parse, starting from the current position.
  module.Parser.prototype.current = function() {
    return this.text.substr(this.position);
  };

  // Asserts that there is no more text to parse.
  module.Parser.prototype.end = function() {
    return module.end(this);
  }

  // Assmbles and returns a message from the current error.
  module.Parser.prototype.errorMessage = function() {
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
  module.Parser.prototype.excerpt = function() {
    var current = this.current();

    if (current.length == 0) {
      return "end of text";
    }

    if (current.length < this.excerptLength) {
      return "'" + current + "'";
    }

    return "'" + current.substr(0, this.excerptLength) + " ...'";
  };

  module.Parser.prototype.expected = function(name) {
    return "Expected " + name + " but got " + this.excerpt();
  }

  // Signals that a parser error has occured, chaining the new error.
  module.Parser.prototype.fail = function(message) {
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

  // Returns true if a parser error has occured, false otherwise.
  module.Parser.prototype.failure = function() {
    return this.error != undefined;
  };

  // Parses a float, either positive or nigtave, posiibly with an exponent.
  module.Parser.prototype.float = function() {
    return module.float(this);
  }

  // Parses an integer, either positive or negative.
  module.Parser.prototype.integer = function() {
    return module.integer(this);
  }

  module.Parser.prototype.many = function(parserFunc, atLeast) {
    return module.many(parserFunc, atLeast)(this);
  }

  // Parses one of several possibilities returning the result of the 
  // first rule to succeed. If none of the possibilities succeed the
  // error message of the rule which consumed the most text is used.
  module.Parser.prototype.oneOf = function(possibilities) {
    return module.oneOf(possibilities)(this);
  }

  // Replaces the message of the topmost error.
  module.Parser.prototype.refail = function(message) {
    if (this.error == undefined) {
      return;
    }
    else {
      this.error.message = message;
      this.error.innerError = undefined;
    }
  }

  // Parses and returns a match for the given regular expression pattern.
  module.Parser.prototype.regex = function(pattern) {
    return module.regex(pattern)(this);
  }

  // Parses and returns the given string.
  module.Parser.prototype.string = function(string) {
    return module.string(string)(this);
  }

  // Returns true if no parser error has occured, false otherwise.
  module.Parser.prototype.success = function() {
    return this.error == undefined;
  }

  // Parses one or more whitespace characters (space, tab, newline).
  module.Parser.prototype.whitespace = function() {
    return module.whitespace(this);
  }

  // Parses one or more space characters.
  module.Parser.prototype.space = function() {
    return module.space(this);
  }

  // Parses one or more space characters.
  module.Parser.prototype.newline = function() {
    return module.newline(this);
  }

  return module;
}
)();
