PREFIX = /usr/bin/

install:
	mkdir -p $(DESTDIR)$(PREFIX)
	cp -f latexwrapper $(DESTDIR)$(PREFIX)

uninstall:
	rm -f $(DESTDIR)$(PREFIX)/latexwrapper
