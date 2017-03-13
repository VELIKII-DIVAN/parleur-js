# parleur.js Tutorial
This tutorial covers basic usage and should get you up and running with 
*parleur.js*.

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

## Meta Rules
We can parse or expression and throw a nice error if it fails -- awesome! But
what if we wanted our variables to have other values than an integer? What
about a float?

To do this we can use *meta rules*, which are rules that take other rules as its
arguments. If we want to parse an integer *or* a float, we can use the `oneOf`
rule:

```
function parseVariable(text) {
  var parser = new Parleur.Parser(text);
  parser.string("var");
  parser.space();
  var name = parser.regex("[a-zA-Z]+");
  parser.space();
  parser.string("=");
  parser.space();
  var value = parser.oneOf(Parleur.int, Parleur.float); // Parses an int or a float
  parser.end();

  if (parser.success()) {
    return { name: name, value: value }
  }

  throw parser.errorMessage();
}
```

For technical reasons you can't use `parser.rule` calls inside meta rules.
Instead you should call `Parleur.rule`. All rules are provided for both parser
instances and the `Parleur` module.

We should now be able to parse something like `var foo = 42.42`.

## Making our own Parser rule
To avoid clutter and to make bigger, more maintainable parsers, we can make
our own parser rules. A parser rule always has the skeleton:

```
function rule(parser) {
  if (parser.failure()) return undefined;

  // Calls to other rules goes here

  if (parser.success()) {
    // Build and return result here
  }

  return undefined;
}
```

First we check if the parser has failed. Parser rules are always called, even
though the parser has failed. So for performance reasons and better error
messages we always check and return if the parser is in error state.

We should try an example. Lets move the value part of our previous parser
to its own rule:

```
function varValue(parser) {
  if (parser.failure()) return undefined;

  var result = parser.oneOf(Parleur.int, Parleur.float); // Parses an int or a float

  if (parser.success()) {
    return result;
  }

  parser.refail("Expected value");
  return undefined;
}
```

Notice that we call the `parser.refail(message)` function. When we call meta
rules, they don't know anything about the rules we give them. Therefore they
aren't able make very good error messages. The `refail` function replaces the
current error message, which can be used to give better, more precise error
messages.

To call our new rule we just call it:

```
function parseVariable(text) {
  var parser = new Parleur.Parser(text);
  parser.string("var");
  parser.space();
  var name = parser.regex("[a-zA-Z]+");
  parser.space();
  parser.string("=");
  parser.space();
  var value = varValue(parser) // Call to our own rule
  parser.end();

  if (parser.success()) {
    return { name: name, value: value }
  }

  throw parser.errorMessage();
}
```

And that's it, there is actually not much more to know about *parleur.js*.
If you take a look at the [source code](https://github.com/PelleJuul/parleur.js/blob/master/src/parleur.js)
you will see that most of the standard rules are implemented just like our own
rule.

The only thing I can think of, that we haven't covered, is how to build
context dependent parsers -- maybe I'll write about that in the future.
