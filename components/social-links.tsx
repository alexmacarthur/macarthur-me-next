import LinkedInIcon from "./icon-linkedin";
import TwitterIcon from "./icon-twitter";
import GitHubIcon from "./icon-github";

import { LINKS } from "../lib/constants";

const links = [
  {
    title: "Twitter",
    url: LINKS.twitter,
    icon: TwitterIcon,
  },
  {
    title: "LinkedIn",
    url: LINKS.linkedin,
    icon: LinkedInIcon,
  },
  {
    title: "GitHub",
    url: LINKS.github,
    icon: GitHubIcon,
  },
];

const SocialLinks = () => {
  return (
    <ul className="flex space-x-1">
      {links.map((link) => {
        const { icon: Icon, url, title } = link;

        return (
          <li key={url}>
            <a
              title={`${title} Profile`}
              href={url}
              target="_blank"
              rel="noopener nofollow"
              className="block w-10 md:w-12 lg:w-16 h-10 md:h-12 lg:h-16"
            >
              <Icon />
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialLinks;
