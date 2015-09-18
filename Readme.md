Development instructions
========================

First you need to get jekyll. Make sure you have Ruby gems installed and run `gem install jekyll`.
To get all the dependencies install `npm install -g bower-installer` and run `bower-installer`.

That's it - now you are ready to serve the page via `jekyll serve`.

Structure
=========

The Layout is located at _layouts/default.html which contains the js and css imports as well as header and footer of the page.
The main content of the page is located at _includs/page.html. The page includes content from the "de" and "en" folders where the translated content is located. If you want to add a markdown content block you can include it via:
```
{% capture stuff %}{% include {{page.lang}}/background.md %}{% endcapture %}
{{ stuff | markdownify }}
```
But always make sure that the file exists for every language you want to generate.

The different versions are then generated thought the "language" attribute in index.html. The german version is located in index.de.html with "language" set to "de".
