---
title: Formatting My PHP More Efficiently with a Bash Function
ogImage: /uploads/shell.jpg
---

For quite some time now, I’ve been working with a PHP application that, up until recently, had no clearly-defined coding standards in place. At some point, the decision was made to enforce PSR-2, and to do so at an incremental level. When a file is touched, format to PSR-2.

To do this in the command line, I’ve been using [PHP-CS-Fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer). It’s pretty straightforward in how it works. Call the command, pass a file, specify a standard:

```
php-cs-fixer /path/to/file.php --rules=@PSR2
```

But fairly quickly, typing all those characters added up, and it was made more difficult by the fact that I need to hold `SHIFT` + `2`  in order to crank out an `@`. Woe is me!

## Wrap that Complexity in a Function

To remedy this a bit, I turned to writing a simple Bash function to wrap up some of the work I had been doing over and over. It was a good move. Here’s how it went:

In my `~./zshrc` file, save the following function declaration. If you’re not using [Oh My ZSH](https://ohmyz.sh/), this would be placed in your `~/.bashrc` file, or the configuration file for whatever shell you’re using.

```
function fphp {
    php-cs-fixer fix $1 --rules=@PSR2
}
```

To actually use the function, you’ll need to reload your configuration file.

```
source ~/.zshrc
```

After that, you’re ready to run! Instead of specifying a long command name, pasting in the file path, and setting a standard, you can just run this to get the same result.

```
fphp /path/to/file.php
```

## Handling Multiple Paths

That’s much better, but sometimes, you might want to format several different files by file path at once. Using the version of PHP-CS-Fixer that I am (2.14.0), it’s technically possible to do this, but requires [some extra work](https://github.com/FriendsOfPHP/PHP-CS-Fixer/issues/2390) I didn’t want to deal with. Without doing that extra work, the following error is thrown:

```
php-cs-fixer /path/to/file.php /path/to/some/other/file.php --rules=@PSR2
```

```
In ConfigurationResolver.php line 579:
For multiple paths config parameter is required.
```

Thankfully, since the functionality we want is all wrapped up in a function, it’s relatively easy to beef that sucker up to handle multiple paths as we provide them. Basically, take whatever arguments our function is given and run the same command on each of them.

```
function fphp {
    for filePath in "$@"
    do
        php-cs-fixer fix $filePath --rules=@PSR2
    done
}
```

Run `source ~/.zshrc`, and now we can easily format multiple files at once:

```
fphp /path/to/file.php /path/to/some/other/file.php
```

## We've Only Bashed the Surface

Obviously, my use case here is pretty specific, and there are a bazillion other ways Bash funcification (just coined that; it better stick) can optimize your command line workflow. As a top-of-mind example, my teammate and _buddy_ [Buddy Reno has written about using them](https://medium.freecodecamp.org/bash-shortcuts-to-enhance-your-git-workflow-5107d64ea0ff) to awesomely overhaul how you use Git in your projects.

Whatever your entry point has been or will be, do your part and be generous with your findings! To start, if you've got a Bash-related tip that's been helpful to you in the past, share it here!

