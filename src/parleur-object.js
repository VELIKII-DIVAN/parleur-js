var Parleur = require('./parleur-base.js');

// Constructor for Parser object, takes the text to parse.
Parser = function(text) {
  this.text = text;
  this.position = 0;
  this.error = undefined;
};

// Parses at least `count` instances of `rule`.
Parser.prototype.atLeast = function(count, rule) {
  return Parleur.atLeast(count, rule)(this);
}

// Parses multiple rules in sequence.
Parser.prototype.chain = function(rules) {
  return Parleur.chain(rules)(this);
}

// Parses a rule delimited by begin and end strings (such as parentheses).
Parser.prototype.delimited = function(beginRule, endRule, rule) {
  return Parleur.delimited(beginRule, endRule, rule)(this);
}

// Returns the text to parse, starting from the current position.
Parser.prototype.current = function() {
  return this.text.substr(this.position);
};

// Asserts that there is no more text to parse.
Parser.prototype.end = function() {
  return Parleur.end(this);
}

// Assmbles and returns a message from the current error.
Parser.prototype.errorMessage = function() {
  var message = "";
  var error = this.error;

  while (true) {
    message += error.message;
    
    if (error.innerError == undefined) {
      message += ' (column ' + error.position + ')';
      break;
    }
    else {
      message += ':\n';
      error = error.innerError;
    }
  }

  return message;
}

// Returns an excerpt of the current text with the given length.
Parser.prototype.excerpt = function(length) {
  var text = this.current();

  if (text.length <= length) {
    return text;
  }

  return text.substr(0, 4) + " ...";
}

// Makes a string of the format 'Unexpected '<text> ...' (expected name)'
Parser.prototype.expected = function(name) {
  return 'Unexpected \'' + this.excerpt(4) + '\' (expected ' + name + ')';
}

// Signals that a parser error has occured, chaining the new error.
Parser.prototype.fail = function(message) {
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
Parser.prototype.failure = function() {
  return this.error != undefined;
};

// Parses a floating point number.
Parser.prototype.float = function() {
  return Parleur.float(this);
}

// Parses an integer.
Parser.prototype.int = function() {
  return Parleur.int(this);
}

// Parses a newline character.
Parser.prototype.newline = function() {
  return Parleur.newline(this);
}

// Parses many instances of a rule, with an optional minimal amount.
Parser.prototype.many = function(rule) {
  return Parleur.many(rule)(this);
}

// Parses one of several possibilities returning the result of the 
// first rule to succeed. If none of the possibilities succeed the
// error message of the rule which consumed the most text is used.
Parser.prototype.oneOf = function(possibilities) {
  return Parleur.oneOf(possibilities)(this);
}

// Makes the given rule optional, returns undefined if the rule fails.
Parser.prototype.optional = function(rule) {
  return Parleur.optional(rule)(this);
}

// Replaces the message of the topmost error.
Parser.prototype.refail = function(message) {
  if (this.error == undefined) {
    return;
  }
  else {
    this.error.message = message;
    this.error.innerError = undefined;
  }
}

// Parses and returns a match for the given regular expression pattern.
Parser.prototype.regex = function(pattern) {
  return Parleur.regex(pattern)(this);
}

// Many instances of one rule separated by a string.
Parser.prototype.separated = function(separator, rule) {
  return Parleur.separated(separator, rule)(this);
}

// Parses and returns the given string.
Parser.prototype.string = function(string) {
  return Parleur.string(string)(this);
}

// Returns true if no parser error has occured, false otherwise.
Parser.prototype.success = function() {
  return this.error == undefined;
}

// Parses one or more whitespace characters (space, tab, newline).
Parser.prototype.whitespace = function() {
  return Parleur.whitespace(this);
}

// Parses one or more space characters.
Parser.prototype.space = function() {
  return Parleur.space(this);
}

// Parses one or more space characters.
Parser.prototype.newline = function() {
  return Parleur.newline(this);
}

module.exports.Parser = Parser;
