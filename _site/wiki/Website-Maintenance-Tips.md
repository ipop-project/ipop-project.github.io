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
git commit -m "Adding wiki as submodule"
git push
```

# Remove Wiki Submodule

Delete the relevant section from the `.gitmodules` file.

Stage the .gitmodules changes `git add .gitmodules`.

Delete the relevant section from `.git/config`.

Run `git rm --cached path_to_submodule` (no trailing slash).

Run `rm -rf .git/modules/path_to_submodule`.

Commit `git commit -m "Removed submodule <name>"`.

Delete the now untracked submodule files `rm -rf path_to_submodule`.

# Importing Wiki into Jekyll Website

- Don't use colons in the page title.
- Place an empty line before each table.

In order to make relative links in wiki pages work correctly inside Jekyll weisbite, Comment out this line in `_config.yml`:
```
permalink: /:categories/:title/
```