# touchlay.com

## Setup / Running

 * Make sure you have Ruby gems installed.
 * Get jekyll: `gem install jekyll`
 * Get dependencies: `npm install -g bower-installer`, then run `bower-installer`

Now you can run the website in development mode: `./dev.sh`


## Structure

The *layout* is located at `_layouts/default.html`, which contains the js and css
imports as well as header and footer of the page.

The *main content* of the page is located at `_includs/page.html`. The page
includes content from the `de` and `en` folders where the translated content is
located. If you want to add a markdown content block you can include it via:

```
{% capture stuff %}{% include {{ page.lang }}/background.md %}{% endcapture %}
{{ stuff | markdownify }}
```

Always make sure that the file exists for every language you want to generate.

The different versions are then generated through the `language` attribute in
`index.html`.

For example, The *german* version is located in `de/index.html` with `language`
set to `de`.

If you want to add sub-pages, add them in the language folder (`en`, `de`, ...)
and link to them with `{{ page.lang }}/PAGE.html`.


## Assets

Always make sure to load assets with the absolute path.

To load images with the absolute path just prepend `{{ site.url }}`, which will
resolve to `//touchlay.com` (or `//localhost:4000` in development mode).
