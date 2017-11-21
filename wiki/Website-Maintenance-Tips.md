# Website Maintenance Tips

## Quick Guide to Website Update

### Step 1: Initialization

```
mkdir -p ~/workspace && cd ~/workspace
git clone https://github.com/vahid-dan/ipop-project.github.io.git
cd ipop-project.github.io
rm -rf _site
git rm -rf --cached wiki/
rm -rf .git/modules/wiki
rm -rf wiki
git submodule add https://github.com/ipop-project/ipop-project.github.io.wiki.git wiki
```

### Step 2: Apply the Desired Changes

Apply the desired changes.

### Step 3: Build the Static Pages and Test the Website Locally

```
mkdir -p _site/wiki && touch _site/wiki/_Sidebar.html
bundle exec jekyll build
JEKYLL_ENV=production bundle exec jekyll serve
```

### Step 4: Update the GitHub Repo

```
rm -rf ~/workspace/_site
cp -r _site ~/worksapce
rm -rf wiki
git add .
git commit -m "Website Updated"
git push
git checkout master
rm -r *
cp -r ~/workspace/_site/* .
git add .
git commit -m "Website Updated"
git push
```

## Website Git Structure
- Source Files Including Markdown Files for Pages: source Branch
- Static Pages Built by Jekyll: master Branch
- The website needs to be loaded from the branch with static pages since there are some unsupported plugins used on the website which will not build-able online by GitHub Jekyll. We have to build the website locally and then upload the static pages to the GitHub.

## Domain Name

`CNAME` file in the root of the repo contains the domain name, `ipop-project.org` in this case. This should be set just for the main repo, `https://github.com/ipop-project/ipop-project.github.io` in this case, not other forks on GitHub. Otherwise, it throws an error while building the website on the GitHub.

## Configuration

With the current configuration set in the _config.yml for the `url` and `baseurl`, the website should be displayed fine locally and on the main addresses, `ipop-project.github.io` and `ipop-project.org`, not on the forked repos like `https://vahid-dan.github.io/ipop-project.github.io/`. There, the styles won't get loaded and the URLs will be set to the main repo.

## Integrated Wiki

To update the website integrated wiki based on the GitHub Wiki and also the first time after cloning the repo, the Wiki submodule should be updated. Otherwise, the wiki pages will be missing on the website.

### Update Wiki Submodule

In the main repo, source branch:

```
git rm -rf --cached wiki/
rm -rf .git/modules/wiki
rm -rf wiki
git submodule add https://github.com/ipop-project/ipop-project.github.io.wiki.git wiki
```

### Add Wiki as Submodule

In the main repo:

```bash
git submodule add https://github.com/ipop-project/ipop-project.github.io.wiki.git wiki
git commit -m "Wiki Added as a Submodule"
```

### Remove Wiki Submodule

Delete the relevant section from the `.gitmodules` file.

Stage the .gitmodules changes `git add .gitmodules`.

Delete the relevant section from `.git/config`.

Run `git rm -rf --cached wiki/`.

Run `rm -rf .git/modules/wiki`.

Commit `git commit -m "Wiki Submodule Removed"`.

Delete the now untracked submodule files `rm -rf wiki`.

[Reference](https://git.wiki.kernel.org/index.php/GitSubmoduleTutorial#Removal)

## Build Jekyll Website Locally

### Prerequisite

```
sudo gem install bundler
sudo apt install ruby-dev
```
In the main repo, source branch:

```
bundle install
```

### Work on the Website Locally

```
touch _site/wiki/_Sidebar.html
bundle exec jekyll build
bundle exec jekyll serve
```

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

Remove default layout and sidebar from `_Sidebar.html`. Exclude everything except `{{ content }}`. Check the `default.html` content.

use [jekyll-include-absolute-plugin](https://github.com/tnhu/jekyll-include-absolute-plugin) to add support for including files outside the `_includes` directory.

**Note:** This plugin doesn't work on GitHub. So we have to build it locally and then upload the `_site` directory to `gh-pages` branch and change the GitHub settings so that it loads the website from `gh-pages` branch instead of `master` branch.

Include `_Sidebar.md` to the Jekyll include list in `_config.yml`:

```yml
include:
  - _Sidebar
```

Insert the sidebar in the wiki template `wiki.html`. Check  the file content.

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

## Issues

There is a line in the `_layouts/wiki.html` to include the wiki sidebar, ```_site/wiki/_Sidebar.html```:

If the file doesn't exist, Jekyll will throw an error while building the website. It usually happens when you want to delete the old generated files in `_site` directory and re-build them. This line will always be checked even if it is in a condition that is not TRUE.

A workaround would be to create an empty file at that path manually and after a successful Jekyll build, run the build for the second time to include the wiki sidebar:

```
touch _site/wiki/_Sidebar.html
bundle exec jekyll build
bundle exec jekyll build
```