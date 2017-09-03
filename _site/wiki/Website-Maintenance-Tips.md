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

# Importing Wiki into Jekyll Website

- Don't use colons in the page title.
- Place an empty line before each table.

```
vd@interface-wired-ipop:~/workspace/ipop-project.github.io/wiki$ rm Overview\:-XMPP\,STUN\,TURN.md 
vd@interface-wired-ipop:~/workspace/ipop-project.github.io/wiki$ rm Deploying-XMPP-STUN-TURN-Services.md
```
In order to make relative links in wiki pages work correctly inside Jekyll weisbite, Comment out this line in `_config.yml`:
```
permalink: /:categories/:title/
```