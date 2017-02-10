# simpleparser.js
A JavaScript library for build text parsers. Implements the class *SimpleParser* which offers parser primitives, which allow you to build more complex rules. 

## Tutorial
In this short tutorial we're going to build a parser rule which parses expression like `var foo = 42`. First we should create a parser instance
```javascript
var textToParse = "var foo = 42";
var parser = new SimpleParser.Parser(textToParse);
```
Make sure that you have included *simpleparser.js* in your html document.

Next we create the skeleton for our parser rule. A parser rule is simply a function which takes a `SimpleParser.Parser` instance as its only argument. This looks like
```javascript
function parseVar(parser) {
  // 1. Optional check that we have not already failed.
  if (parser.failure()) return undefined;
  
  // 2. Calls to other parser rules.
  
  if (parser.success()) {
     // 3. Assembly and return of result value.
  }
  
  // 4. Optional descriptive error message
  parser.fail("Failed to parse variable assignment");
  // 5. Return undefined
  return undefined;
}
```

1. `SimpleParser.Parser` executes parse funtions even though we have already failed. For performance reasons - and to avoid error message confusion - we should return straight away if the parser is in failure state.
2. This is where most of the magic happens. Here we will call other parse rules, whoose return values we will use to assemble the return value of our rule.
3. After checking that we have not failed, we're sure that all parsed values are good and defined. We can then use them to build an object and return it.
4. If we have reached this point in the rule, it means that the parsing has failed. Calling `Parser.fail(message)` when we have already failed will add it the `message` as context to the previous error.
5. When a parser rule fails it should return `undefined` (unless it does not have a return value).

Now we're ready to get into the good stuff. To parse our expression "var foo = 42" we will need to do the following steps:

1. Parse the string "var ".
2. Parse the name of our variable.
3. Parse the string " = ".
4. Parse the value of our variable, which we assume is a whole number.

We can use the built in rules to achieve this. The implementation looks like:
```javascript
function parseVar(parser) {
  if (parser.failure()) return undefined;
  
  parser.string("var ");
  var name = parser.regex("[a-zA-Z]+");
  parser.string(" = ");
  var value = parser.integer()");
  
  if (parser.success()) {
    return { name: name, value: value };
  }
  
  parser.fail("Failed to parse variable assignment");
  return undefined;
}
```
Here we use the `Parser.string(string)` function to parse the two exact strings `var ` and ` = `. The function `Parser.regex(pattern)` is used to parse the name of our variable. `Parser.integer()` is used to parse the value. Inside the if-statement we use the parsed values to build an object, which represents our variable assignment. 

We should now try to use our rule. We call it like this:
```javascript
var textToParse = "var foo = 42";
var parser = new SimpleParser.Parser(textToParse);
var varExpression = parseVar(parser);
parser.end();

if (parser.success()) {
  console.log("Success!");
}
else {
  console.log(parser.errorMessage();
}
```
Notice that we have added a `Parser.end()` call. This makes sure that we have parsed all the input text. If we did not make this call our parser would accept strings like `var a = 5 thisisnotsupposedtobehere`. If our parser failed, we use `Parser.errorMessage()` to get a nice error description. Lets look at some example input/output pairs:

```
> var foo = 42
< Success!

> var myvariable = -4200
< Success!

> var foo = 42 thisisnotsupposedtobehere
< Expected end of text but got ' thisisnotsu ...' (column 12)

> var foo = bar
< Failed to parse variable assignment:
< Expected an integer but got 'bar' (column 10)

> var foo + bar
< Failed to parse variable assignment:
< Expected ' = ' but got ' + bar ' (column 7)
```

That pretty much wraps it up. Have fun building your own parsers!

*The code for this tutorial can be found in examples/var.html*

## Running the Examples
To run the examples you will need to run a development server from the root directory of this repository. One possibility is to use PHP, which you can start with
```
$ php -S 127.0.0.1:8080
```
You can then find the example you're look for by going to *127.0.0.1:8080/examples/someExample.html*

## Contributing
Everyone is welcome to contribute! The source code is very simple. The framework and basic API is up and running, so now we only need to add more primitive parse rules. Some suggestions are:

- [ ] Character
- [x] Whitespace
- [x] String
- [ ] Integer
- [x] Float
- [x] Regex
- [ ] Multiple instances of a rule
- [ ] List of a rule with separator
- [ ] One of several possible rules
- [ ] A rule enclosed in parenteses or other delimiters
