import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "./logo";
import { useEffect, useState } from "react";
import MenuToggle from "./menu-toggle";

const navItems = [
  {
    name: "Posts",
    link: "/posts",
  },
  {
    name: "Projects",
    link: "/projects",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Contact",
    link: "/contact",
  },
];

const Nav = ({ isAbsolute = false }) => {
  const router = useRouter();
  const [shouldHideLogo, setShouldHideLogo] = useState(() => {
    return router.route === "/";
  });

  useEffect(() => {
    const handleRouteChange = (url) => {
      setShouldHideLogo(url === "/");
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  const positionClass = isAbsolute ? "absolute" : "relative";

  return (
    <nav
      className={`z-10 py-10 px-4 md:px-8 w-full font-bold flex items-center justify-between nav ${positionClass}`}
    >
      <input
        type="checkbox"
        id="menuToggle"
        className="absolute opacity-0 lg:hidden -z-10"
        aria-labelledby="menuToggleLabel"
      />

      <span
        className={`flex-none font-bold text-2xl lg:text-3xl ${
          shouldHideLogo ? "opacity-0 pointer-events-none" : ""
        }`}
      >
        <Logo asLink={true} short={true} />
      </span>

      <div className="nav-menu-wrapper fixed w-full left-0 top-0 h-0 lg:relative lg:h-auto lg:l-0">

        <label
          className="cursor-pointer relative z-20 lg:hidden nav-menu-label absolute right-3"
          htmlFor="menuToggle"
          style={{
            top: "2.25rem"
          }}
          id="menuToggleLabel"
        >
          <MenuToggle />
        </label>

        <div
          className="
          invisible
          nav-menu-items
          bg-gray-700
          top-0
          absolute
          lg:relative
          transition-all
          opacity-0
          p-10
          flex
          flex-col
          justify-center
          h-screen
          w-screen
          -z-10
          lg:z-10
          lg:p-0
          lg:visible
          lg:relative
          lg:top-auto
          lg:opacity-100
          lg:bg-transparent
          lg:h-auto
          lg:w-auto
          lg:block
        "
        >
          <ul
            className="
            transition-all
            flex
            flex-col
            lg:flex-row
            space-y-4
            lg:space-x-4
            lg:space-y-0
            lg:translate-x-0
            justify-end transform
            -translate-x-full"
          >
            {navItems.map((item) => {
              return (
                <li
                  className="text-6xl lg:text-xl font-bold lg:font-light text-white lg:text-gray-500 hover:text-white lg:hover:text-gray-900 lg:font-200"
                  key={item.link}
                >
                  <Link href={item.link}>{item.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
