// Runs a list of rules in sequence, returning a list of the results.
chain = function(rules) {
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
delimited = function(beginRule, endRule, rule) {
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
end = function(parser) {
  if (parser.failure()) return undefined;

  if (parser.current() === "") {
    return;
  }
  
  parser.fail(parser.expected('end of text'));
  return undefined;
}

// Parses a floating point number
float = function(parser) {
  if (parser.failure()) return undefined;

  var valueString = parser.regex('(0|[1-9][0-9]*)(\\.[0-9]+)?(e(0|[1-9][0-9]+))?');

  if (parser.success()) {
    return parseFloat(valueString);
  }

  parser.refail(parser.expected('float'));
  return undefined;
}

// Parses an integer, either positive or negative.
int = function(parser) {
  if (parser.failure()) return undefined;

  var valueString = parser.regex('(0|[1-9][0-9]*)');

  if (parser.success()) {
    return parseInt(valueString);
  }

  parser.refail(parser.expected('integer'));
  return undefined;
}

// Builds a function which takes a parser and parses multiple instances of one
// rule, with an optional required count.
many = function (parserFunc) {
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
newline = function(parser) {
  if (parser.failure()) return;

  var result = parser.regex('(\n|\r\n)+');

  if (parser.success()) {
    return result;
  }

  parser.refail(parser.expected('newline'));
}

// Builds a function which takes a parser, and parses one of several
// possibilities returning the result of the first rule to succeed. If none of
// the possibilities succeed the error message of the rule which consumed the
// most text is used.
oneOf = function(possibilities) {
  return function(parser) {
    if (parser.failure()) return undefined;

    var startPos = parser.position;
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

      parser.position = startPos;
      parser.error = undefined;
    }

    parser.error = topError;
    parser.fail('Error while in oneOf (use refail to provide a more meaningful error message)');
    return undefined;
  }
}

// Makes the given rule optional, returns undefined if the rule fails.
optional = function(rule) {
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
regex = function(pattern) {
  return function(parser) {
    if (parser.failure()) return undefined;

    if (!pattern.startsWith('^')) {
      pattern = '^' + pattern;
    }

    var regex = new RegExp(pattern);
    var current = parser.current();
    var matches = regex.exec(current);

    if (matches == null) {
      parser.fail(parser.expected('a match for the pattern ' + pattern)); 
      return undefined;
    }

    var match = matches[0];
    parser.position += match.length;

    return match;
  }
}

// Many instances of one rule separated by a string.
separated = function(separatorRule, rule) {
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

// Parses one or more space characters.
space = function(parser) {
  if (parser.failure()) return;

  var result = parser.regex(" +");

  if (parser.success()) {
    return result;
  }

  parser.refail(parser.expected('space'));
}

// Builds a function which takes a parser, and parses and returns the given
// string.
string = function(string) {
  return function(parser) {
    if (parser.failure()) return;

    if (parser.current().startsWith(string)) {
      parser.position += string.length;
      return string;
    }

    parser.fail(parser.expected('\'' + string + '\''));

    return undefined;
  }
}

// Parses one or more whitespace characters (space, tab, newline).
whitespace = function(parser) {
  if (parser.failure()) return;

  var result = parser.regex('( |\t|\n|\r)+');

  if (parser.success()) {
    return result;
  }

  parser.refail(parser.expected('whitespace'));
}

module.exports.chain = chain;
module.exports.delimited = delimited;
module.exports.end = end;
module.exports.float = float;
module.exports.int = int;
module.exports.many = many;
module.exports.newline = newline;
module.exports.oneOf = oneOf;
module.exports.optional = optional;
module.exports.regex = regex;
module.exports.separated = separated;
module.exports.space = space;
module.exports.string = string;
module.exports.whitespace = whitespace;
