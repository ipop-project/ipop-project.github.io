Travis CI is a hosted continuous integration platform that is free for all open source projects hosted on Github. With just a file called `.travis.yml` containing some information about our project, we can trigger automated builds with every change to our code.

These instructions are based on following links:
* [https://travis-ci.com/getting_started](https://travis-ci.com/getting_started)
* [https://docs.travis-ci.com/](https://docs.travis-ci.com/)

## Activate GitHub Repositories
1.  Sign in to Travis CI with your GitHub account, accepting the GitHub access permissions confirmation.

2.  Once you’re signed in, and Travis CI has synchronized your repositories from GitHub, go to your [profile](https://travis-ci.com/profile) page and enable Travis CI for the repository you want to build.

3.  Flip the switch to on for all repositories you'd like to enable.


## Write configuration file to your repository
In order for Travis CI to build your project, you'll need to write a file named `.travis.yml`.

1.  Add a `.travis.yml` file to the root of your repository.

2.  Following the link below to write configuration information into `.travis.yml` file.

  [https://docs.travis-ci.com/user/getting-started/](https://docs.travis-ci.com/user/getting-started/)

3.  Here is a sample `.travis.yml` configuration file for ipop-tincan repository:
  ```bash
  language: cpp
  compiler:
  - g++
  os:
  - linux
  before_install:
  - sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
  - sudo apt-get update -qq
  install:
  - sudo apt-get install g++-4.8 -y
  - sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.8 50
  script: make
  ```
  **Tip:** _Because the g++ version(4.6) on Travis CI is lack of support for c++11, so we need to install a newer version g++(4.8+) to build the code._


## Trigger your first build with a git push

1.  To start a build, perform one of the following:
  * Commit and push something to your repository
  * Go to your repository's settings page, click on "Webhooks & Services" on the left menu, choose "Travis CI" in the "Services", and use the "Test service" button.

  **Note:** _You cannot trigger your first build using Test Hook button. It has to be triggered by a push to your repository._


2.  Check the [build status](https://travis-ci.org/repositories) page to see if your build passes or fails.