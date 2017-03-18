sources=src/index.js src/parleur-object.js src/parleur-base.js
main=src/index.js
packed=dist/parleur.pack.js
minified=dist/parleur.min.js
distdir=dist

distributable: $(minified)

$(minified): $(packed) $(distdir)
	./node_modules/uglify-js/bin/uglifyjs $(packed) -o $(minified)

$(packed): $(sources) $(distdir)
	./node_modules/webpack/bin/webpack.js $(main) $(packed) 

$(distdir):
	mkdir $(distdir)

.PHONY: clean publish test

publish: distributable
	npm publish

test:
	./node_modules/mocha/bin/mocha "test/*.js"

clean:
	rm -rf dist
