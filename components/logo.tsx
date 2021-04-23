import { ReactElement, useEffect } from "react";
import BezierEasing from "bezier-easing";
import { useRouter } from "next/router";
import { randomInRange } from "../lib/utils";

/**
 * Get the current custom property value for the gradient angle.
 */
const getCurrentAngle = (): number => {
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(
    "--gradient-angle"
  );

  return Number(rawValue.replace("deg", ""));
};

/**
 * Ensures that a degree value falls in the 0-360 range.
 */
const toDegreeableValue = (value: number): number => {
  return ((value % 360) + 360) % 360;
};

/**
 * Given an angle, find the next range the logo should rotate toward.
 */
const selectRange = (angle: number): Array<any> => {
  const ranges = [
    [0, 20],
    [160, 180],
    [181, 200],
    [340, 360],
  ];

  const activeRangeIndex = ranges.findIndex((range) => {
    return range[0] <= angle && angle <= range[1];
  });

  // Ensure that the last index rolls over to the first range.
  return ranges[activeRangeIndex === 3 ? 0 : activeRangeIndex + 1];
};

type LogoProps = {
  asLink?: boolean;
  short?: boolean;
}

const Logo = ({ asLink = false, short = false }: LogoProps ): ReactElement => {
  const router = useRouter();
  const logoText: string = short ? "AM" : "Alex MacArthur";

  useEffect(() => {
    let rafId: number = 0;
    let startTime: number = null;
    const startingAngle = getCurrentAngle();
    const range = selectRange(startingAngle);
    let destinationAngle: number = randomInRange(range[0], range[1]);
    destinationAngle =
      destinationAngle < startingAngle
        ? destinationAngle + 360
        : destinationAngle;

    const duration = 750;
    const totalDegreesToTurn = destinationAngle - startingAngle;
    const easing = BezierEasing(0.65, 0.3, 0.3, 1);

    const gradientEffect = async () => {
      const turnGradient = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const runTime = timestamp - startTime;
        const relativeProgress = runTime / duration;
        const easedProgress = easing(relativeProgress);
        const easedDegrees = totalDegreesToTurn * Math.min(easedProgress, 1);
        const newAngleFromStartingAngle = startingAngle + easedDegrees;

        document.documentElement.style.setProperty(
          "--gradient-angle",
          `${toDegreeableValue(newAngleFromStartingAngle)}deg`
        );

        if (runTime < duration) {
          rafId = requestAnimationFrame(turnGradient);
        }
      };

      (document as any).fonts.status === "loaded" ||
        (await (document as any).fonts.ready);

      rafId = requestAnimationFrame(turnGradient);
    };

    gradientEffect();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const children = (
    <span className="block z-30 text-gray-900 left-0 top-0 gradient-text font-extrabold">
      { logoText }
    </span>
  );

  const constructedLogo = asLink ? (
    <a
      href={"/"}
      className="outline-none"
      onClick={(e) => {
        e.preventDefault();

        router.push("/");
      }}
    >
      {children}
    </a>
  ) : (
    children
  );

  return <span className="relative block">{constructedLogo}</span>;
};

export default Logo;
