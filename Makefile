PREFIX = /usr/local
BIN_PREFIX = $(DESTDIR)$(PREFIX)/bin
DAT_PREFIX = $(DESTDIR)$(PREFIX)/share/latexwrapper

install:
	mkdir -p $(BIN_PREFIX) $(DAT_PREFIX)
	cp -f latexwrapper $(BIN_PREFIX)
	cp -f symbols.org template.tex $(DAT_PREFIX)

uninstall:
	rm -f $(BIN_PREFIX)/latexwrapper
	rm -fr $(DAT_PREFIX)/

.PHONY: install uninstall
