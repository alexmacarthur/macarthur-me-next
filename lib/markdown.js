import remark from "remark";
import strip from "strip-markdown";
import allImageData from "./image-data.json";
import markdownPrism from 'markdown-it-prism';
import markdownAnchor from 'markdown-it-anchor';

const markdown = require('markdown-it')({
  html: true
});

const customizeMarkdown = (markdownObj, slug) => {
  const postImageData = allImageData[slug];

  return markdownObj.use((md, config) => {
    md.renderer.rules.image = function (tokens, idx, options, env, self) {
      config = config || {}

      const token = tokens[idx]
      const imageSourceIndex = token.attrIndex('src');
      let src = token.attrs[imageSourceIndex][1];
      let height, width;
      const absoluteRegex = new RegExp("^(http(s?)://)");

      if (!src.match(absoluteRegex)) {
        const cleanedSrc = src.replace(/^\.\//, "");
        const { width: imgWidth, height: imgHeight } = postImageData[
          cleanedSrc
        ];

        width = imgWidth;
        height = imgHeight;
        src = `/post-images/${slug}/${cleanedSrc}`;
      }

      return `<img
        data-lazy-src="${src}"
        height="${width}"
        height="${height}"
        class="transition-opacity opacity-0 mx-auto block" />`;
    }

    // Make headings anchorable:

    md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const idIndex = token.attrIndex('id');
      const id = token.attrs[idIndex][1];
      return `<${token.tag}><a href="#${id}">`;
    }

    md.renderer.rules.heading_close = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      return `</a></${token.tag}>`;
    }

    // Open links in new tab:

    const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
      } else {
        tokens[idx].attrs[aIndex][1] = '_blank';
      }

      return defaultRender(tokens, idx, options, env, self);
    };
  });
};

export function processMarkdown(rawMarkdown, slug) {
  const markdownObj = customizeMarkdown(markdown.use(markdownPrism).use(markdownAnchor), slug);

  return markdownObj.render(rawMarkdown);
}

export function stripMarkdown(markdown) {
  const result = remark().use(strip).processSync(markdown);

  return result.toString();
}
