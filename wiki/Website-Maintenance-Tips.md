# Website Maintenance Tips

## Deploying the Static Jekyll Website from Local Repository to GitHub gh-pages Branch

While using custom or unsupported plugins, it is necessary to upload the static website files, already built on the local repository to the GitHub repository and choose the website to be loaded from that.

### Install and Run Jekyll Github Deploy

```bash
gem install jgd
jgd
```
### Alternative: Use Git

First push everything from the local repo to the master branch. Then:

```bash
git checkout master
rm -rf _site
git clone -b gh-pages `git config remote.origin.url` _site
jekyll build
cd _site
git add -A
git commit -am 'Static Pages Built'
git push
```
[Reference](https://stackoverflow.com/questions/17835937/how-do-i-push-jekyll-site-directory-to-gh-pages-branch-and-leave-the-source-in)

## Change GitHub Settings

```
Settings > GitHub Pages > Source > gh-pages branch > Save
```

## Page Layouts

Page layout for pages without the sidebar is 'splash'. Default page layout can be changed in '_config.yml'.

## Add Wiki as Submodule

In the main repo:

```bash
git submodule add https://github.com/ipop-project/ipop-project.github.io.wiki.git wiki
git commit -m "Wiki Added as a Submodule"
```

## Remove Wiki Submodule

Delete the relevant section from the `.gitmodules` file.

Stage the .gitmodules changes `git add .gitmodules`.

Delete the relevant section from `.git/config`.

Run `git rm --cached wiki/`.

Run `rm -rf .git/modules/wiki`.

Commit `git commit -m "Wiki Submodule Removed"`.

Delete the now untracked submodule files `rm -rf wiki`.

[Reference](https://git.wiki.kernel.org/index.php/GitSubmoduleTutorial#Removal)

## Add YAML Front Matter to Wiki MarkDown Source Files

Use [Jekyll Optional Front Matter](https://github.com/benbalter/jekyll-optional-front-matter
) plugin.

## Importing Wiki into Jekyll Website

In order to make relative links in wiki pages work correctly inside Jekyll website, remove the `/` from the end of the following line in `_config.yml`:

```yml
permalink: /:categories/:title/
```

## Redirect Wiki Home

### Utilizing a Redirected Layout

This technique would allow you to set up redirects for your pages without resorting to any plugin. All you need to do is create a layout named redirected.html in your _layouts folder. The content of this layout would be as shown below:

```html
<!DOCTYPE html>
<html>
<head>
<link rel="canonical" href="{{ page.redirect_to }}"/>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="refresh" content="0;url={{ page.redirect_to }}" />
</head>
<body>
      <a href="{{ page.redirect_to }}">Redirecting ...</a>
      <script>location='{{ page.redirect_to }}'</script>
</body>
</html>
```

Once you have this layout ready, then to set up redirect from any page, all you need to do is specify redirected as your layout in its YAML front matter and specify the destination in redirect_to as shown below. in `wiki.md`:

```yml
---
layout: redirected
sitemap: false
permalink: /wiki/
redirect_to:  Home
---
```

Note that, I have also included sitemap: false in the front matter as I don’t want the redirected pages to be included in the sitemap.

[Reference](https://superdevresources.com/redirects-jekyll-github-pages/)

## Add Table of Contents to the Wiki Pages

[jekyll-toc](https://github.com/toshimaru/jekyll-toc)

**Note:** This plugin doesn't work on GitHub. So we have to build it locally and then upload the `_site` directory to `gh-pages` branch and change the GitHub settings so that it loads the website from `gh-pages` branch instead of `master` branch.

To make it appear in all the wiki pages automatically, add `toc: true` to the wiki layout settings defaults in `_config.yml`:

```yml
  # wiki
  - values:
      toc: true
```

## Integrate Wiki Sidebar into the Website

Remove default layout and sidebar from `_Sidebar.html`. Exclude everything except `{{ content }}`.  
In `default.html`:

```html
---
---
{% if page.url != '/wiki/_Sidebar' %}
<!doctype html>
<!--
  Minimal Mistakes Jekyll Theme 4.5.1 by Michael Rose
  Copyright 2017 Michael Rose - mademistakes.com | @mmistakes
  Free for personal and commercial use under the MIT license
  https://github.com/mmistakes/minimal-mistakes/blob/master/LICENSE.txt
-->
<html lang="{{ site.locale | slice: 0,2 | default: "en" }}" class="no-js">
  <head>
    {% include head.html %}
    {% include head/custom.html %}
  </head>

  <body class="layout--{{ page.layout | default: layout.layout }}{% if page.classes or layout.classes %}{{ page.classes | default: layout.classes | join: ' ' | prepend: ' ' }}{% endif %}">

    {% include browser-upgrade.html %}
    {% include masthead.html %}
{% endif %}

    {{ content }}

{% if page.url != '/wiki/_Sidebar' %}
    <div class="page__footer">
      <footer>
        {% include footer/custom.html %}
        {% include footer.html %}
      </footer>
    </div>

    {% include scripts.html %}

  </body>
</html>
{% endif %}
```

use [jekyll-include-absolute-plugin](https://github.com/tnhu/jekyll-include-absolute-plugin) to add support for including files outside the `_includes` directory.

**Note:** This plugin doesn't work on GitHub. So we have to build it locally and then upload the `_site` directory to `gh-pages` branch and change the GitHub settings so that it loads the website from `gh-pages` branch instead of `master` branch.

Include `_Sidebar.md` to the Jekyll include list in `_config.yml`:

```yml
include:
  - _Sidebar
```

Insert the sidebar in the wiki template `wiki.html`:

{% raw %}
```html
---
layout: default
---

{% if page.header.overlay_color or page.header.overlay_image or page.header.image %}
  {% include page__hero.html %}
{% elsif page.header.video.id and page.header.video.provider %}
  {% include page__hero_video.html %}
{% endif %}

{% if page.url != "/" and site.breadcrumbs %}
  {% unless paginator %}
    {% include breadcrumbs.html %}
  {% endunless %}
{% endif %}

{% if page.url != '/wiki/_Sidebar' %}
<div id="main" role="main">
  <div class="sidebar">
    <nav class="nav__list">
      <div class="wiki-top-links">
        <a href="../wiki">Wiki Home</a> / <a href="../wikipages">Wiki Pages</a>
      </div>
        {% include_absolute _site/wiki/_Sidebar.html %}
    </nav>
  </div>

  <article class="page" itemscope itemtype="http://schema.org/CreativeWork">
    {% if page.title %}<meta itemprop="headline" content="{{ page.title | markdownify | strip_html | strip_newlines | escape_once }}">{% endif %}
    {% if page.excerpt %}<meta itemprop="description" content="{{ page.excerpt | markdownify | strip_html | strip_newlines | escape_once }}">{% endif %}
    {% if page.date %}<meta itemprop="datePublished" content="{{ page.date | date: "%B %d, %Y" }}">{% endif %}
    {% if page.last_modified_at %}<meta itemprop="dateModified" content="{{ page.last_modified_at | date: "%B %d, %Y" }}">{% endif %}

    <div class="page__inner-wrap">
      <section class="page__content" itemprop="text">
{% endif %}

        {{ content }}

{% if page.url != '/wiki/_Sidebar' %}
      </section>
    </div>
  </article>
</div>
{% endif %}
```
{% endraw %}

Add proper styles to `main.scss`:

```css
.layout--wiki .sidebar .nav__list strong {
  display: block;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  font-family: -apple-system,".SFNSText-Regular","San Francisco","Roboto","Segoe UI","Helvetica Neue","Lucida Grande",Arial,sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 1px solid #f2f3f3;
}

.layout--wiki .sidebar .wiki-top-links {
  font-size: .775em;
}

.layout--wiki .sidebar li {
  font-size: .85em;
}
```
