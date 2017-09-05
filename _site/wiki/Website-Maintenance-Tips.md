# Deploying the Static Jekyll Website from Local Repository to GitHub gh-pages Branch

While using custom or unsupported plugins, it is necessary to upload the static website files, already built on the local repository to the GitHub repository and choose the website to be loaded from that.

## Install and Run Jekyll Github Deploy

```gem install jgd```

```jgd```

# Change GitHub Settings

```Settings > GitHub Pages > Source > gh-pages branch > Save```

# Page Layouts

Page layout for pages without the sidebar is 'splash'. Default page layout can be changed in '_config.yml'.

# Add Wiki as Submodule

In the main repo:

```
git submodule add https://github.com/ipop-project/ipop-project.github.io.wiki.git wiki
git commit -m "Wiki Added as a Submodule"
```

# Remove Wiki Submodule

Delete the relevant section from the `.gitmodules` file.

Stage the .gitmodules changes `git add .gitmodules`.

Delete the relevant section from `.git/config`.

Run `git rm --cached wiki`.

Run `rm -rf .git/modules/wiki`.

Commit `git commit -m "Wiki Submodule Removed"`.

Delete the now untracked submodule files `rm -rf wiki`.

[Reference](https://git.wiki.kernel.org/index.php/GitSubmoduleTutorial#Removal)

# Add YAML Front Matter to Wiki MarkDown Source Files

Use [Jekyll Optional Front Matter](https://github.com/benbalter/jekyll-optional-front-matter
) plugin.

# Importing Wiki into Jekyll Website

- Don't use colons in the page title.
- Place an empty line before each table.

In order to make relative links in wiki pages work correctly inside Jekyll weisbite, remove the `/` from the end of the following line in `_config.yml`:
```
permalink: /:categories/:title/
```

# Redirect Wiki Home

## Utilizing a Redirected Layout
This second technique would allow you to set up redirects for your pages without resorting to any plugin. All you need to do is create a layout named redirected.html in your _layouts folder. The content of this layout would be as shown below:

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

```
---
layout: redirected
sitemap: false
permalink: /wiki/
redirect_to:  Home.html
---
```

Note that, I have also included sitemap: false in the front matter as I don’t want the redirected pages to be included in the sitemap.

[Reference](https://superdevresources.com/redirects-jekyll-github-pages/)

# Add Table of Contents to the Wiki Pages

[jekyll-toc](https://github.com/toshimaru/jekyll-toc)

To make it appear in all the wiki pages automatically, add `toc: true` to the wiki layout settings defaults in `_config.yml`.