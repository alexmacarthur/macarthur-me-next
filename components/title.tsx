import DateFormatter from "./date-formatter";
import Button from "./button";
import ViewCount from "./view-count";

type TitleProps = {
  children: React.ReactNode;
  date?: string;
  prettyDate?: string;
  isPost?: boolean;
  subTitle?: string;
  lastUpdated?: string;
  prettyLastUpdated?: string;
  secondaryMeta?: Function;
  views?: string;
};

const Title = ({
  children,
  date,
  prettyDate,
  isPost,
  subTitle,
  lastUpdated,
  prettyLastUpdated,
  secondaryMeta,
  views,
}: TitleProps) => {
  return (
    <div className="mt-1 lg:mt-6 mb-4 lg:mb-9">
      <div>
        {isPost && (
          <span className="block mb-3 mr-4 text-base">
            <Button
              href="/posts"
              internal={true}
              naked={true}
              pointLeft={true}
              small={true}
              classes={"text-gray-500"}
              inheritColor={true}
            >
              Back to Posts
            </Button>
          </span>
        )}

        <h1 className="text-4xl md:text-6xl font-extrabold pb-2 gradient-text inline-block leading-none">
          {children}
        </h1>

        {subTitle && (
          <h2 className="font-light text-xl italic text-gray-500 mb-2">
            {subTitle}
          </h2>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <>
              <DateFormatter date={lastUpdated} prettyDate={prettyLastUpdated}>Updated on </DateFormatter>

              <span className="light-text">/</span>
            </>
          )}

          {date && (
            <DateFormatter date={date} prettyDate={prettyDate}>
              {lastUpdated && "Originally posted on"}
            </DateFormatter>
          )}

          <ViewCount count={views} disableAnimation={true} />
        </div>

        {secondaryMeta && secondaryMeta()}
      </div>
    </div>
  );
};

export default Title;
