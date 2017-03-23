# Parleur-js Reference
## Parser Object
A Parser object looks like:
```
var parser = {
  text = text;
  position = 0;
  error = undefined;
};
```
`text` is all the text to parse. `position` counts how much of the text we have already parsed. `error` holds an error object, if any.

If the parser is in *failure state*, the `error` field will hold an error object looking like:

```
parser.error = {
  message: message,
  position: 0
  innerError: undefined
};
```
`message` is a string describing the error. `position` specifies where the error happened. In case this error was caused by another error,
`innerError` will hold the original error object.

## Basic Functions

#### `Parser.current()`
Returns the remaining text to parse.

#### `Parser.errorMessage()`
Returns a nice string representation of the current error.

#### `Parser.excerpt(length)`
* `length` a positive integer.

Returns an excerpt of the current text of length `length`. Used for creating nice error messages.

#### `Parser.fail(message)`
* `message` a string describing the reason for failure.

Puts the parser into *failure state* with `message` describing the reason for the failure.

#### `Parser.failure()`
Return `true` if the parser has failed, otherwise `false`.

#### `Parser.refail(message)`
* `message` a string describing the reason for failure.

Replaces the message of the current error - if any - with `message`.

## Basic Parse Rules
#### `Parser.end()`
Asserts that there is no more text left to parse. Returns `undefined`.

#### `Parser.float()`
Parses and returns a positive floating-point number.

#### `Parser.int()`
Parses and returns a positive integer.

#### `Parser.newline()`
Parses and returns one or more newline characters.

#### `Parser.regex(pattern)`
* `pattern` a regex pattern to parse.

Parses a match for the regular expression `pattern`.

#### `Parser.space()`
Parses one or more space characters.

#### `Parser.string(string)`
* `string` a string.

Parses and returns the given `string`.

#### `Parser.whitespace()`
Parses one or more whitespace characters.

## Combinators
Combinators are parse rules which takes other parse rules as its argument(s). To use the combinators you will have to use `Parleur.rule`
rather than `Parser.rule`, for example if we were calling `Parser.chain`;

```
parser.chain(parser.int, parser.string("foo"));   // WRONG
parser.chain(Parleur.int, Parleur.string("foo")); // RIGHT
```

#### `Parser.atLeast(count, rule)`
* `count` the minimal number of `rule`s to parse.
* `rule` the rule to parse.

Parses as many instances of `rule` as possible. Fails if less than `count` instances was parsed.

#### `Parser.chain(rules)`
* `rules` a list a parse rules

Runs each rule in `rules` in sequence and returns a list of the results. Fails if any of the given rules fails.

#### `Parser.delimited(beginRule, endRule, rule)`
* `beginRule` a parse rule for the beginning delimiter.
* `endRule` a parse rule for the ending delimiter.
* `rule` a parse rule for the stuff we whish to be delimited.

Parses`beginRule`, `rule` and then `endRule` and returns the results of `rule`. Fails if any of the given rules fails.

#### `Parser.many(rule)`
* `rule` a parser rule.

Parses as many instances of `rule` as possible.

#### `Parser.oneOf(rules)`
* `rules` a list of parse rules.

Runs the rules of `rules` in sequences, returning the result of the first one to succeed. Fails if none
of the rules succeeded.

#### `Parser.optional(rule)`
* `rule` a parse rule.

#### `Parser.separated(separatorRule, rule)`
* `separatorRule` a parse rule for the separator.
* `rule` a parse rule.

Parses list of `rule` separated by `separatorRule`. Returns a list of the results from `rule`. The list may be empty or may only
contain one element.

