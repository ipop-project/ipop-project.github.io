For code contributors, the process of developing and committing code to IPOP is outlined below.

[**Handy reference for Git commands**](http://git-scm.com/docs/gittutorial)

1.  [Fork the repo](http://help.github.com/fork-a-repo/).

2.  Clone your newly-forked repo to your local machine (use the clone
    URL from the repository page on GitHub):

        $ git clone git@github.com:<username>/ipop-tincan.git
        $ cd ipop-tincan

    Git will refer to this repository (your fork) as `origin`.

3.  Configure the upstream remote (use the clone URL from the page
    for the corresponding
    [ipop-project](https://github.com/ipop-project/) repository):

        $ git remote add upstream https://github.com/ipop-project/ipop-tincan.git

    Git will refer to this repository as `upstream`.

4.  Create a branch for the feature you will work on:

        $ git checkout -b my-feature

5.  Develop on the **my-feature** branch. Commit changes to **my-feature**
    branch:

        $ git add .
        $ git commit -m "commit message"

    Always keep the first line of the commit message shorter than 55
    characters. If you need to write a longer commit message, use just `git
    commit` (no `-m` flag) which will open your $EDITOR for you to write the
    commit message. Make sure to use a blank line to separate the first line
    from the rest of the commit message.

6.  Push your branch to GitHub periodically.

        $ git push origin my-feature

    Caution: Don't **pull** or **merge** from upstream. Doing so creates
    weird-looking merge commits and makes the history messy. Instead,
    when you want to incorporate upstream commits into your branch, you
    should **rebase**, as described below.

7.  Fetch upstream changes that were done by other contributors:

        $ git fetch upstream

8.  If you need to incorporate new upstream changes into your branch,
    **rebase** your branch on top of the upstream master:

        $ git rebase upstream/master

    In the process of the **rebase**, Git may discover conflicts. In
    that case it will stop and allow you to fix the conflicts. After
    fixing conflicts, use `git add .` to update the index with those
    contents, and then run:

        $ git rebase --continue

    Run `git status` liberally during a rebase if you are confused. It
    will tell you what you need to do to continue.

9.  Push your branch to GitHub.

        $ git push origin my-feature

    If you rebased earlier, your commits will have been re-written and
    GitHub may deny your push because it would involve overwriting
    commits you pushed earlier. In that case you will have to use the
    `--force` flag.  **Never `--force` to a branch that other people are
    using!** (In that scenario, you should just create a new branch and
    push it.)

        $ git push origin my-feature --force

10. When ready, send a [pull
    request](http://help.github.com/send-pull-requests/).

For more information on Git workflows and commands, see the resources
here: <http://git-scm.com/documentation/external-links>

* * *

This document is based on
<https://github.com/sevntu-checkstyle/sevntu.checkstyle/wiki/Development-workflow-with-Git%3A-Fork,-Branching,-Commits,-and-Pull-Request>.