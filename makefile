distdir=dist
source=src/index.js
packed=dist/parleur.pack.js
minified=dist/parleur.min.js

distributable: $(minified)

$(minified): $(packed) $(distdir)
	./node_modules/uglify-js/bin/uglifyjs $(packed) -o $(minified)

$(packed): $(source) $(distdir)
	./node_modules/webpack/bin/webpack.js $(source) $(packed) 

$(distdir):
	mkdir $(distdir)

.PHONY: clean publish test

publish: distributable
	npm publish

test:
	./node_modules/mocha/bin/mocha "test/*.js"

clean:
	rm -rf dist