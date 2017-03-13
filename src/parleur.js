var Parleur = (function() {
  var module = {};

  // ---- ---- MODULE LEVEL PARSER FUNCTIONS ---- ---- //

  module.chain = function(rules) {
    var builtRule = function(parser) {
      if (parser.failure()) return undefined;

      var results = [];

      for (i = 0; i < rules.length; i++) {
        var result = rules[i](parser);
        results.push(result);
      }

      if (parser.success()) {
        return results;
      }

      return undefined;
    };

    return builtRule;
  };

  // Parses a rule delimited by begin and end strings (such as parentheses).
  module.delimited = function(beginRule, endRule, rule) {
    var builtRule = function(parser) {
      if (parser.failure()) return undefined;

      beginRule(parser);
      var result = rule(parser);
      endRule(parser);

      if (parser.success()) {
        return result;
      }

      return undefined;
    };

    return builtRule;
  };

  // Builds a function which takes a parser, and asserts that it has no more 
  // text to parse.
  module.end = function(parser) {
    if (parser.failure()) return undefined;

    if (parser.current() === "") {
      return;
    }
    
    parser.fail("Expected end of text");
    return undefined;
  }

  // Parses a floating point number
  module.float = function(parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("(0|[1-9][0-9]*)(\\.[0-9]+)?(e(0|[1-9][0-9]+))?");

    if (parser.success()) {
      return parseFloat(valueString);
    }

    parser.refail("Expected float");
    return undefined;
  }

  // Parses an integer, either positive or negative.
  module.int = function(parser) {
    if (parser.failure()) return undefined;

    var valueString = parser.regex("(0|[1-9][0-9]*)");

    if (parser.success()) {
      return parseInt(valueString);
    }

    parser.refail("Expected integer"); 
    return undefined;
  }

  // Builds a function which takes a parser and parses multiple instances of one
  // rule, with an optional required count.
  module.many = function (parserFunc) {
    var builtFunction = function(parser) {
      if (parser.failure()) return undefined;
      var results = [];

      while (true) {
        var result = parserFunc(parser);
        
        if (parser.failure()) {
          parser.error = undefined;
          break;
        }

        results.push(result);
      }

      return results;
    };

    return builtFunction;
  };

  // Parses one or more newline characters.
  module.newline = function(parser) {
    if (parser.failure()) return;

    var result = parser.regex("(\n|\r\n)+");

    if (parser.success()) {
      return result;
    }

    parser.refail("Expected newline");
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

        var topPosition = topError ? topError.position : -1;
        var isNewTopError = parser.error.position > topPosition;

        if (topError == undefined || isNewTopError) {
          topError = parser.error;
        }

        parser.error = undefined;
      }

      parser.error = topError;
      parser.fail("Error while in oneOf (use refail to provide a more meaningful error message)");
      return undefined;
    }
  }

  // Makes the given rule optional, returns undefined if the rule fails.
  module.optional = function(rule) {
    var builtRule = function(parser) {
      if (parser.failure()) return;

      var result = rule(parser);

      if (parser.failure()) {
        parser.error = undefined;
        return undefined;
      }

      return result;
    };

    return builtRule;
  };

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
        parser.fail("Expected a match for the regular expression '" + pattern + "'"); 
        return undefined;
      }

      var match = matches[0];
      parser.position += match.length;

      return match;
    }
  }

  // Many instances of one rule separated by a string.
  module.separated = function(separatorRule, rule) {
    var builtRule = function(parser) {
      if (parser.failure()) return undefined;

      var ruleWithSeparator = function(innerParser) {
        separatorRule(innerParser);
        var result = rule(innerParser);
        return result;
      };

      var results = [];
      var head = rule(parser);

      if (head != undefined) {
        results.push(head);
        var tail = parser.many(ruleWithSeparator, 0); 
        results = results.concat(tail);
      }

      // Possibly `head` failed, then we should just return an empty list.
      if (parser.failure()) {
        parser.error = undefined;
      }

      return results;
    };

    return builtRule;
  };

  // Builds a function which takes a parser, and parses and returns the given
  // string.
  module.string = function(string) {
    return function(parser) {
      if (parser.failure()) return;

      if (parser.current().startsWith(string)) {
        parser.position += string.length;
        return string;
      }

      parser.fail("Expected '" + string + "'");

      return undefined;
    }
  }

  // Parses one or more whitespace characters (space, tab, newline).
  module.whitespace = function(parser) {
    if (parser.failure()) return;

    var result = parser.regex("( |\t|\n|\r)+");

    if (parser.success()) {
      return result;
    }

    parser.refail("Expected whitespace");
  }

  // Parses one or more space characters.
  module.space = function(parser) {
    if (parser.failure()) return;

    var result = parser.regex(" +");

    if (parser.success()) {
      return result;
    }

    parser.refail("Expected space");
  }

  // ---- ---- PARSER PROTOTYPE DEFINITION ---- ---- //

  // Constructor for Parser object, takes the text to parse.
  module.Parser = function(text) {
    this.text = text;
    this.position = 0;
    this.error = undefined;
    this.excerptLength = 12;
  };

  module.Parser.prototype.chain = function(rules) {
    return module.chain(rules)(this);
  }

  // Parses a rule delimited by begin and end strings (such as parentheses).
  module.Parser.prototype.delimited = function(beginRule, endRule, rule) {
    return module.delimited(beginRule, endRule, rule)(this);
  }

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

  // Parses a floating point number.
  module.Parser.prototype.float = function() {
    return module.float(this);
  }

  // Parses an integer.
  module.Parser.prototype.int = function() {
    return module.int(this);
  }

  // Parses a newline character.
  module.Parser.prototype.newline = function() {
    return module.newline(this);
  }

  // Parses many instances of a rule, with an optional minimal amount.
  module.Parser.prototype.many = function(rule) {
    return module.many(rule)(this);
  }

  // Parses one of several possibilities returning the result of the 
  // first rule to succeed. If none of the possibilities succeed the
  // error message of the rule which consumed the most text is used.
  module.Parser.prototype.oneOf = function(possibilities) {
    return module.oneOf(possibilities)(this);
  }

  // Makes the given rule optional, returns undefined if the rule fails.
  module.Parser.prototype.optional = function(rule) {
    return module.optional(rule)(this);
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

  // Many instances of one rule separated by a string.
  module.Parser.prototype.separated = function(separator, rule) {
    return module.separated(separator, rule)(this);
  }

  // Parses and returns the given string.
  module.Parser.prototype.string = function(string) {
    return module.string(string)(this);
  }

  // Returns true if no parser error has occured, false otherwise.
  module.Parser.prototype.success = function() {
    return this.error == undefined;
  }

  // Parses a word (a sequence of letters).
  module.Parser.prototype.word = function() {
    return module.word(this);
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
