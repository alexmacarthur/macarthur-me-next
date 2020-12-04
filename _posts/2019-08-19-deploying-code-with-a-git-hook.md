---
title: Deploying Code with a Git Hook on a DigitalOcean Droplet
ogImage: 'https://images.pexels.com/photos/256229/pexels-photo-256229.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1200'
---

I've been working on a project involving long-running, resource-intensive batch jobs in Node. At first, when my needs were simpler, I used Heroku to run these jobs. It was great, but eventually, the price:performance ratio offered became a little too unwieldy, and I chose to make a move from Heroku to DigitalOcean.

Almost immediately, I was impressed. In just a short while, I was up and running these jobs with little issue. But there was one challenge I had yet to work out: setting up some sort of deployment process to get the code from my Git repository to my droplet. I was spoiled with Heroku. They make that part of the job incredibly hassle-free. But thankfully, when I made the move to DO, my needs were relatively straightforward:

- On a `git push`, I wanted my code to be copied to my droplet.
- On that same push, I wanted to `npm install` the dependencies in my `package.json`.
- I wanted the option to control which branches would trigger a deployment to that droplet.

As it turned out, the setup was less complicated than I had been expecting. A single Git hook and a little local configuration meet all the needs noted above. This post is basically me backing up and documenting all that I pieced together from experimenting and Googling. Note that I'm not gonna get into the weeds of configuring a DigitalOcean or any other VPS. For the purposes of what I'm showing off here, just make sure you have a SSH access to your droplet, and that Git's installed on it.

## Configure a Remote Repository on Your Droplet

**First, create a bare repository on your droplet.** A bare repository is one created without a working tree and used solely for _sharing_ code -- not working with it. We'll only be pushing to this repository, so `--bare` is the way to go.

For this example, kick this of by `ssh`-ing into your droplet, creating a `neat-app-repo` directory, and initializing that repository.

```bash
ssh user@your-ip-address
cd /home
mkdir neat-app-repo
cd neat-app-repo
git init --bare
```

**Create a `post-receive` hook file inside your newly created repository.** If you're unfamiliar with them, [catch up.](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hook) In short, this hook will allows to do _something_ after code has been _received_ by the repository on the droplet (ie. when we do a `git push`). In our case, all we want to happen after our code is received is for it to be moved to a different directory and its dependencies installed.

If you `cd` into your `neat-app-repo/hooks` directory (this is one of the directories created when you initialized the bare repository), you should see a long list of `*.sample` Git hooks. While you're there, create a _new_ `post-receive` hook:

```bash
touch post-receive
```

And paste the following bones in there:

```bash
#!/bin/bash

while read oldrev newrev ref
do
    # We gonna do stuff.
done
```

That's a `bash` `while read` loop with three parameters:

`oldrev` - The SHA for the previous commit in the pushed branch.

`newrev` - the SHA for the new commit in the pushed branch.

`ref` - the Git reference of the branch just pushed. Example: `refs/heads/master`

Inside of that block, we're free to do whatever we want, like copy the branch that was just pushed to a different directory:

```diff
#!/bin/bash

+# Location of our bare repository.
+GIT_DIR="/home/neat-app-repo"
+
+# Where we want to copy our code.
+TARGET="/home/neat-app-deployed"

while read oldrev newrev ref
do
-   # We gonna do stuff.
+   # Neat trick to get the branch name of the reference just pushed:
+   BRANCH=$(git rev-parse --symbolic --abbrev-ref $ref)
+
+   # Send a nice message to the machine pushing to this remote repository.
+   echo "Push received! Deploying branch: ${BRANCH}..."
+
+   # "Deploy" the branch we just pushed to a specific directory.
+   git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
done
```

After saving that, a couple more steps are required before it's actually usable:

1. Make sure that hook is executable. If you skip this, you'll get a `The 'hooks/post-receive' hook was ignored because it's not set as executable` error when you push from your machine.

```bash
chmod +x post-receive
```

2. Make sure the target directory actually exists. If it doesn't, you'll get another error.

```bash
mkdir /home/neat-app-deployed
```

Now, for testing purposes, open up the repository on your local machine and set the `origin` to where your bare repository is located on your droplet.

```bash
git remote add origin root@YOUR_IP_ADDRESS:/home/neat-app-repo
```

Make an arbitrary commit and give it a `git push`. If successful, you should see something like this.

```bash
remote: Push received! Deploying branch: master...
remote: Switched to branch 'master'
```

**Now, let's (optionally) limit new deployments to specific branches.** If you make a new branch and push it to your droplet, you'll see it deploys successfully, just as if you were on `master`. Probably less than ideal, so let's modify our hook to deploy only when the master branch is pushed.

```diff
#!/bin/bash

# Location of our bare repository.
GIT_DIR="/home/neat-app-repo"

# Where we want to copy our code.
TARGET="/home/neat-app-deployed"

while read oldrev newrev ref
do
    # Neat trick to get the branch name of the reference just pushed:
    BRANCH=$(git rev-parse --symbolic --abbrev-ref $ref)

+    if [[ $BRANCH == "master" ]];
+    then
        # Send a nice message to the machine pushing to this remote repository.
        echo "Push received! Deploying branch: ${BRANCH}..."

        # "Deploy" the branch we just pushed to a specific directory.
        git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
+    else
+       echo "Not master branch. Skipping."
+    fi
done
```

Gr8! Now, since my project was in Node, I needed to set up one final thing: **run `npm install`on each deployment.** In my case, `nvm` is in charge of specifying which version of Node I run, so updating my hook looks like this:

```diff
#!/bin/bash

# Location of our bare repository.
GIT_DIR="/home/neat-app-repo"

# Where we want to copy our code.
TARGET="/home/neat-app-deployed"

while read oldrev newrev ref
do
    # Neat trick to get the branch name of the reference just pushed:
    BRANCH=$(git rev-parse --symbolic --abbrev-ref $ref)

    if [[ $BRANCH == "master" ]];
    then
        # Send a nice message to the machine pushing to this remote repository.
        echo "Push received! Deploying branch: ${BRANCH}..."

        # "Deploy" the branch we just pushed to a specific directory.
        git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH
    else
        echo "Not master branch. Skipping."
    fi

+   # Source nvm to make it available for use inside this script.
+   . $HOME/.nvm/nvm.sh
+
+   # Use the LTS version of Node.
+   nvm use --lts
+
+   # Navigate to where my deployed code lives.
+   cd /home/neat-app-deployed
+
+   # Install dependencies in production mode.
+   npm install --production
done
```

And with that, pushing to my droplet will now deploy my code exactly where I want it, as well as install the dependencies it needs to run.

## Configure Your Local Repository for Easier Deployments

When I first got this all set up, I assumed that if I wanted to push my code up to a remote GitHub repository _and_ deploy it to DO simultaneously, I'd need to create two remotes and push them separately. Then I saw this tweet:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">TIL you can add two different Git repo URLs on the same remote and a single `git push` will push to both. Sometimes the orange website is useful! <a href="https://t.co/lwjEmj1RAM">pic.twitter.com/lwjEmj1RAM</a></p>&mdash; Dave Ceddia (@dceddia) <a href="https://twitter.com/dceddia/status/1153365976588664833?ref_src=twsrc%5Etfw">July 22, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

One push, two destinations. And with our `post-receive` hook only deploying pushes to the `master` branch, this is a good balance of efficiency and safety for our workflow.

Admittedly, configuring my Git remotes locally was a little weird, but working it all out eventually came to this. Note: this assumes you already had the DO droplet set as your `origin`.

```bash
# Change the `fetch` URL, so we always pull code from GitHub.
git remote set-url origin git@github.com:alexmacarthur/neat-app.git

# Re-add `push` URLs, so that we push to GitHub AND DigitalOcean.
git remote set-url --add --push origin root@YOUR_IP_ADDRESS:/home/neat-app-repo
git remote set-url --add --push origin git@github.com:alexmacarthur/neat-app.git
```

In the end `git remote -v` returns this:

```bash
origin  root@YOUR_IP_ADDRESS:/home/neat-app-repo (fetch)
origin  git@github.com:alexmacarthur/neat-app.git (push)
origin  root@YOUR_IP_ADDRESS:/home/neat-app-repo (push)
```

With that configured, a simple `git push` sends your code to two separate remotes, saving you seconds per day, perhaps.

## Expect Gotchas

While it might be conceptually straightforward, working through the details of all this was periodically frustrating for me, especially since it was my first time pulling off such a thing. That said, give yourself a little grace in dealing with the gotchas that will inevitably come up. Hopefully what you read here will help alleviate the pains of the process even just a little bit. If that's true, writing this all out was worth it.
