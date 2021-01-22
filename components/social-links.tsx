import LinkedInIcon from "./icon-linkedin";
import TwitterIcon from "./icon-twitter";
import GitHubIcon from "./icon-github";
import { createElement } from "react";

import { LINKS } from "../lib/constants";

const links = [
  {
    url: LINKS.twitter,
    icon: TwitterIcon,
  },
  {
    url: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    url: LINKS.github,
    icon: GitHubIcon,
  },
];

const SocialLinks = () => {
  return (
    <ul className="flex space-x-1">
      {links.map((link) => {
        const { icon, url } = link;

        return (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener nofollow"
              className="block w-8 h-8"
            >
              {createElement(icon as any)}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;
