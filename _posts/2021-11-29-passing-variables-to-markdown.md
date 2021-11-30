---
title: Passing Variables to Markdown Files in Gatsby
ogImage: "https://images.pexels.com/photos/952594/pexels-photo-952594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1200"
---

All of the documentation and a few miscellaneous text blobs you see on [typeitjs.com](http://typeitjs.com) are sourced from Markdown files built using Gatsby's [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark/) plugin. Sprinkled throughout the content are several references to the current published version of the library (ex: `v8.0.7`). 

When a new version is published, it'd be an error-prone pain to change each of these references manually. Instead, I've set up a programmatic solution, allowing me to drop in fixed variable directly into a Markdown file as needed, and then swap that out for the actual value. So, something like this...

```markdown
# Stuff About TypeIt

The version of TypeIt is @{TYPEIT_VERSION}.
```

...would end up as HTML, but in place of `@{TYPEIT_VERSION}`, there'd remain "v8.0.7" (or whatever the value might be).

The setup for this relatively straightforward, and should be easy enough to replicate on any other similar platform. Let's walk through how that process looked for me:

## Make a Function to Replace Variable Names

The root of the solutions is creating a means of accepting a piece of content, parsing that content for a variable name, and then swapping the names we find with the correct values. We can use a single JavaScript function to make that happen:

```js
const variables = {
    TYPEIT_VERSION: 'v8.0.7', 
    TYPEIT_BUNDLE_SIZE: '3.6kb'
};

const processVariables = (content) => content.replace(/@{(\S+)}/g, (match, variableName) => {
    if(variables[variableName]) return variables[variableName];
    
    throw `Variable does not have value: ${variableName}`;
});
```

As that function accepts content, we run a regular expression against it, which will match any set of characters that contained by "@{" and "}" that does *not* have whitespace in it. Then, for each match we find, we check for the respective value in `variables`. If it's there, return the value. If it's not throw an error, since we probably don't want to ship content that contains ugly, invalid variable names. 

Applying it to a few example strings yields the following results:

```js
processVariables("The version is: @{TYPEIT_VERSION}");
// 'The version is: v8.0.7'

processVariables("This string @{does not match the pattern!}");
// 'This string @{does not match the pattern!}'

processVariables("This string @{MISSING_VALUE}");
// Uncaught: Variable does not have value: MISSING_VALUE
```

With that piece in place, we're ready to integrate it into the Markdown handling process.

## The Quick & Dirty Implementation

If you've gotta cut some corners and just need to get some content on the screen, the (arguably) quickest way to implement our new function is by filtering the processed HTML from your Markdown files before rendering it with React: 

```jsx
import { processVariables } from './some/file.js

const MyPage = (props) => {
    const { typeItVersion } = props.data.site.siteMetadata;
    const { html } = props.data.markdownRemark;

    return (
        <>
            <h1>My Page</h1>
            
            <div dangerouslySetInnerHTML={{
                __html: processVariables(html, { typeItVersion }),
            }}
            />
        </>
    )
};
```

However, there's a slight cost with this approach. Gatsby will server-render the HTML with the processed variables, and will then hydrate the page with the same JS that was initially used the process the content. As a result, you're technically sending more code to the client than needed (negligible impact, but still). Ideally, the variable replacement would exclusively happen on build, and strictly pass the processed content to the client. 

Thankfully, there's a better and not-that-much-more-time-consuming way.

## Create a Tiny Remark **Transformer Plugin**

Gatsby has a blessed means of building plugins to safely integrate with `gatsby-transformer-remark`, and they provide some solid documentation on [getting started](https://www.gatsbyjs.com/tutorial/remark-plugin-tutorial/). For our case, we don't need much. 

First, create a new `plugins/gatsby-remark-process-variables` directory where the plugin will live, and initialize an npm project with an `index.js` file. 

```jsx
mkdir -p plugins/gatsby-remark-process-variables
cd plugins/gatsby-remark-process-variables
npm init --yes
touch index.js
```

Then, load our newly created plugin in the `gatsby-config.js` file: 

```jsx
// ... other stuff
{ 
	plugins: [
        {
        resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    require.resolve(`./plugins/gatsby-remark-process-variables`),
                ],
            },
        }
    ]
}
```

And paste in some simple boilerplate for the plugin: 

```jsx
// plugins/gatsby-remark-process-variables/index.js

module.exports = ({ markdownAST }) => {
	return markdownAST;
}
```

That `markdownAST` refers to the [Markdown Abstract Syntax Tree](https://github.com/syntax-tree/mdast) that we'll be processing. If you're unfamiliar, it's a data specification used to represent content (in this case, Markdown) via JavaScript object. The AST can contain several nested layers of nodes, so instead of writing our own recursive code to crawl through that three, let's use one that handles that for us. 

Install it with `npm install unist-util-map@^2`. That version constraint important, since the latest version of the package is ESM-only, and we're bound to end up with errors during the Gatsby build. This won't be a problem forever, but it's a hassle now. 

After doing so, we're ready to apply our `processVariables` function to each node in the tree.

```diff
// plugins/gatsby-remark-process-variables/index.js

+ const map = require('unist-util-map');
+ const processVariables = require('./some/file.js') 

module.exports = ({ markdownAST }) => {
-	return markdownAST;
+	return map(markdownAST, function (node) {
+    if (node.value) {
+        node.value = processVariables(node.value);
+    }
+
+     return node;
+   });
}
```

With that in place, running and/or building our Gatsby site will result in each Markdown-embedded variable being replaced with the correct value. No more error-prone search & replace, and not a lick of extra clien-side code. 

## See It Live

If you'd like to see the actual code I used on TypeIt's site to pull this all of, [have at it!](https://github.com/alexmacarthur/typeit-site-gatsby/blob/cf2f72ec02a27921f30b93d12aba7703f9ac396b/plugins/gatsby-remark-process-variables/index.js)
