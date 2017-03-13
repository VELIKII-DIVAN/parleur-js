# parleur.js
A JavaScript library for building text parsers. It is inspired by the
parser combinator libraries known from functional programming, such
as Parsec.

*parleur.js* is simple to use and very general. It should be able to handle
pretty much any parsing job you throw at it. Unlike parser generators, like
the traditional Yacc library, *parleur.js* is able to parse context dependent
formats.

## Quick Introduction
I will now walk you through parsing a simple expression using *parleur.js*.
We're going to parse a "variable assignment" like `var foo = 42`.

First we create a `Parleur.Parser` object with the text we want to parse:

```
var parser = new Parleur.Parser("var foo = 42");
```

We then add calls to *parse rules*. A parse rule can be very simple or very
complex, but always work the same: the look for some pattern at the start of the
text, if they succeed they remove the pattern from the text and return it, if
they fail they return undefined and put the parser into *error state*.

Lets just see how it looks:

```
var parser = new Parleur.Parser("var foo = 42");
parser.string("var");
parser.space();
var name = parser.regex("[a-zA-Z]+");
parser.space();
parser.string("=");
parser.space();
var value = parser.int();
parser.end();
```

You should notice that the `parser.<rule>` calls follow our text closely. We
should still explain them though:

* `parser.string("var")` parses the exact string *"var"* and returns the result.
* `parser.space()` parses one or more space characters.
* `parser.regex("[a-zA-Z+]")` parses a match for the pattern *[a-zA-Z+]* -- the
    name of our variable.
* `parser.int()` parses a positive integer.
* `parser.end()` parses nothing, but check that there is no more text left to
    parse.

If everything went well then we should have `name = "foo"` and `value = 42`. If
one of the rules failed the results will be `undefined`.

To check that the parsing succeeded we call `parser.success()`, and we can then
use the parsed values to build our own return value:

```
var parser = new Parleur.Parser("var foo = 42");
parser.string("var");
parser.space();
var name = parser.regex("[a-zA-Z]+");
parser.space();
parser.string("=");
parser.space();
var value = parser.int();
parser.end();

if (parser.success()) {
  return { name: name, value: value }
}
```

For good measure we should put or parser inside a function:

```
function parseVariable(text) {
  var parser = new Parleur.Parser(text);
  parser.string("var");
  parser.space();
  var name = parser.regex("[a-zA-Z]+");
  parser.space();
  parser.string("=");
  parser.space();
  var value = parser.int();
  parser.end();

  if (parser.success()) {
    return { name: name, value: value }
  }

  throw parser.errorMessage();
}
```

If we get to the `throw` statement it means that the parsing has failed. Calling
`parser.errorMessage()` will return a string telling you exactly why and where
the parser failed.

For more examples of how to use *parleur.js* take a look at the tests in *test/*
.

## Contributing
The API should be pretty stable now, so the best way to contribute is to use
*parleur.js* for something. By using it we will be able to figure if anything is
missing or anything should be removed -- or if *parleur.js* is usable at all.

You can also read through the source code and see if you can spot places where
performance or maintainability could be improved.
