---
title: Building a Shell Function to Copy the Latest Git Commit SHA
ogImage: https://images.pexels.com/photos/134059/pexels-photo-134059.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200
---

Frequently enough, I find myself needing to copy the SHA of the latest commit in project, and doing it manually was becoming a chore. I'd been getting more comfortable and excited about improving efficiency by rolling custom shell functions ([like I wrote about here](/posts/formatting-my-php-more-efficiently-with-a-bash-function)), and so this felt like a good candidate for another one. After a bit of searching, this was confirmed -- very little was out there on someone else building a simple terminal command to do such a thing. So, I went for it.

**Problem:** Copy the SHA of my last commit is clunky and takes time.

**Solution:** Make a shell function that'll allow me to do it with a simple terminal command.

## Building the Function
Most of the experimentation I did for this was done in a regular shell script on my machine. But to quickly test the script as a terminal command, I copied my iterations inside my `~/.zshrc` and sourced it with `source ~/.zshrc`. Over time, this is how those iterations progressed.

### Iteration #1 :: Stupid Simple

Setting up the basics of the function was pretty straightforward:

```bash
# `clc` stands for `copy last commit`.
function clc {
    LAST_COMMIT_SHA=$(git rev-parse HEAD)
    echo "$LAST_COMMIT_SHA" | tr -d '\n' | pbcopy
    echo "Copied ${LAST_COMMIT_SHA}."
}
```

At this point, I can run `clc` in my terminal, and by doing so, grab the last commit SHA, remove the line breaks, copy it to the clipboard, and spit out a nice confirmation message. Gets the job done! But.

### Iteration #2 :: Copy From Different Branch

When I'm cherry-picking, I often want the latest commit SHA from different branch -- not my current one. So, I upgraded the function to accept a branch name as a parameter. If the parameter is set, check out that branch, grab the latest commit SHA, and return to the original branch.

```diff
function clc {
+    # The original script wrapped in a nested function:
+    function copy_last_commit() {
        LAST_COMMIT_SHA=$(git rev-parse HEAD)
        echo "$LAST_COMMIT_SHA" | tr -d '\n' | pbcopy
        echo "Copied ${LAST_COMMIT_SHA}."
+    }
+
+    # Added to check out branch, if parameter is set.
+    if [ ! -z "$1" ]; then
+        if git checkout $1 >/dev/null; then
+            copy_last_commit
+            git checkout - >/dev/null
+        else
+            echo "Checkout wasn't successful. Didn't copy anything."
+        fi
+    else
+        copy_last_commit
+    fi
}
```

Now, we can run something like `clc some-branch`. That'll cause the branch to be checked out (`git checkout $1 >/dev/null`), and if that's successful, the copying will commence, spitting out something like this:

```
Switched to branch 'my-branch'
Copied 3ccbd742f916659c50cbff6c2f63e2ba28a168b5.
Switched to branch 'master'
```

If, by chance, I pass a non-existent branch name and it fails, an error message is output. And, of course, if no branch parameter is passed, the just check go straight to copying the commit SHA of the current branch. But!

### Iteration #3 :: Respect Unstaged Changes

Often times, my active branch has a bunch of unstaged changes, and running this command to grab a SHA from a different branch produces this message:

```
Please commit your changes or stash them before you switch branches.
Aborting
Checkout wasn't successful. Didn't copy anything.
```

So, I went for upgrading this again -- this time, instead of completely checking out the branch, using `git stash` to stash away our changes and restore them. It's lot more flexible, not requiring that you have a clean working directory.

In doing this, it's important that we only `stash` when it's actually needed. Running `git stash` when there's nothing to stash does _nothing_ -- no new stash is created. And if we automatically run `git stash pop` when a new stash wasn't actually created, we might end up restoring a previous stash we don't want (you can view all the stashes in your repo using `git stash list`).

I performed this check using `git status -s` and saving it to the variable `IS_DIRTY`. If the working tree is "dirty," stash the changes, and restore them when we're all done.

```diff
function clc {
    # The original script wrapped in a nested function:
    function copy_last_commit() {
        LAST_COMMIT_SHA=$(git rev-parse HEAD)
        echo "$LAST_COMMIT_SHA" | tr -d '\n' | pbcopy
        echo "Copied ${LAST_COMMIT_SHA}."
    }

    # Added to check out branch, if parameter is set.
    if [ ! -z "$1" ]; then
+        IS_DIRTY=$(git status -s)
+
+        if [[ ! -z $IS_DIRTY ]]; then
+            git stash push -u >/dev/null
+            echo "Stashed unstaged stages."
+        fi

        if git checkout $1 >/dev/null; then
            copy_last_commit
            git checkout - >/dev/null
        else
            echo "Checkout wasn't successful. Didn't copy anything."
        fi

+        if [[ ! -z $IS_DIRTY ]]; then
+            git stash pop >/dev/null
+            echo "Restored unstaged changes."
+        fi
    else
        copy_last_commit
    fi
}
```

Because it tripped me up, take extra notice that I'm not using a simple `git stash` command to stash my changes. Instead I'm using `git stash push -u`. This is because I want to stash away _all_ my current changes, including files I might have just created but not yet committed. The more verbose `git stash push` followed by the `-u` (which stands for `--include-untracked`) flag will do just that.

## Iteration #4 :: Tear Down & Rebuild Everything 🤦

At this point, I was feeling pretty good about myself. I had worked through all the weird shell issues I had hit along the way, and actually published this very blog post on the whole process.

And then, a couple of Reddit users (thanks, [nunull](https://www.reddit.com/user/nunull/) and [austin-schaffer](https://www.reddit.com/user/austin-schaffer/)!) pointed out that I don't actually _need_ to perform a checkout just to get at a commit SHA. This should have been obvious since was already using `git rev-parse HEAD` to pull the SHA. Swapping out `HEAD` for whatever branch I need would have done the trick, completely removing the need for any of that complicated checkout and stash logic 🤦.

With that revelation, the function goes from all of those lines of code down to just a few:

```bash
function clc {
    [[ -z $1 ]] && BRANCH=$(git rev-parse --abbrev-ref HEAD) || BRANCH=$1
    LAST_COMMIT_SHA=$(git rev-parse $BRANCH | tail -n 1)
    echo "$LAST_COMMIT_SHA" | tr -d '\n' | pbcopy
    echo "Copied ${LAST_COMMIT_SHA}."
}
```

See, Reddit ain't so bad! Thanks again to the two who called this out!

## See the Touched Up Final Product

I've added a couple of pretty terminal colors in the version that lives in [this Gist](https://gist.github.com/alexmacarthur/933a50c3e072baaf7b6ed18b94e0e873).

## Using the Function

To use this in your local shell, you could throw it in your `~/.bashrc` or `~/.zshrc` file, but it's probably better to store it somewhere else on your system. I can't speak for `bash` users, but if you're using `zsh`, that's just a matter of putting the file in your `$ZSH/custom` directory and sourcing it.

### Install as Custom ZSH Function

To make it super easy, run the following command, which will retrieve the function from my GitHub Gist and put it into the appropriate location:

```bash
curl https://gist.githubusercontent.com/alexmacarthur/933a50c3e072baaf7b6ed18b94e0e873/raw/59f22ae740d83f39a88b70f4aebb0c27b2f9805f/copy-last-commit.zsh -o $ZSH/custom/clc.zsh
```

### Running the Command

After doing that, source it up with `source ~/.zshrc`, and you should be able to run the command.

Running `clc` will return something like this:

```
Copied 3ccbd742f916659c50cbff6c2f63e2ba28a168b5 from master.
```

Running `clc new-branch` will return something like this:

```
Copied 3ccbd742f916659c50cbff6c2f63e2ba28a168b5 from new-branch.
```

## Did I Miss Something?

It wouldn't surprise me. If you have any suggestions or improvements, let me know!
