# About

Jekyll Based Github Pages: see tutorial on [Jekyll](https://jekyllrb.com). If all set, run the following command to test running locally:
```
bundle exec jekyll serve
```
Pass the  `--livereload` option to serve to automatically refresh the page with each change you make to the source files: 
```
bundle exec jekyll serve --livereload
```

Emerging [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). Run with `mkdocs` installed:
```
mkdocs gh-deploy
```
Note that Material for MkDocs cannot be directly emerged with Jekyll, after building Mkdocs site, you need to copy the css style and html element manually to adapt to your original blog environment.
1. Copy `mkdocs.min.css` file into directory `assets/css`, use css formatting tool to restore the format and delete relavant global style, only keeping the element styles.
2. Adding includes into `_layouts/default.html`
```html
<link rel="stylesheet" href="{{site.baseurl}}/assets/css/mkdocs.min.css">
```

Tailpages (Tailwind + Github Pages) is a Jekyll website template based on TailwindCSS, which can be hosted by Github for free. You can visit the demo site at [https://harrywang.me/](https://harrywang.me/).

Key features are:

- Minimalist design inspired by the [indigo template](https://github.com/sergiokopplin/indigo)
- Elegant typography via [TailwindCSS Typography plugin](https://tailwindcss.com/docs/typography-plugin) and [Inter font](https://rsms.me/inter/)
- Markdown support for content authoring (static pages and blogs)
- Code highlighting and styling via [highlight.js](https://highlightjs.org/) (see [code example](http://harrywang.me/tailpages/2022/02/07/code.html))
- Latex support via [MathJax](https://www.mathjax.org/) (see an [example](http://harrywang.me/tailpages/2022/02/09/latex.html))
- Table of Contents support via [jekyll-toc](https://github.com/allejo/jekyll-toc) (see an [example](http://harrywang.me/tailpages/toc))

### Tutorials
- No-code Tutorial: this tutorial shows how you can use Tailpages template to quickly setup your website and blogs without coding, which you can access at [medium](https://harrywang.medium.com/introducing-tailpages-tailwind-github-pages-89903c52d3ec) or [blog](https://harrywang.me/tailpages-tutorial-nocode).
- Technical Tutorial: this tutorial shows how to setup the development environment for Tailpages from scratch, which you can access at [medium](https://harrywang.medium.com/developing-tailpages-a-jekyll-template-based-on-tailwind-css-b8b51e60e25b) or [blog](https://harrywang.me/tailpages-tutorial-technical). 
