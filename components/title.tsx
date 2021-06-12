import DateFormatter from "./date-formatter";
import Button from "./button";

type TitleProps = {
  children: React.ReactNode;
  date?: string | Date;
  isPost?: boolean;
  subTitle?: string;
  lastUpdated?: string;
  secondaryMeta?: Function;
};

const Title = ({
  children,
  date,
  isPost,
  subTitle,
  lastUpdated,
  secondaryMeta,
}: TitleProps) => {
  return (
    <div className="mt-1 lg:mt-6 mb-4 lg:mb-12">
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
        <div>
          {lastUpdated && (
            <>
              <DateFormatter date={lastUpdated}>Updated on </DateFormatter>

              <span className="light-text px-2">/</span>
            </>
          )}

          {date && (
            <DateFormatter date={date} className="mr-4">
              {lastUpdated && "Originally posted on"}
            </DateFormatter>
          )}
        </div>

        {secondaryMeta && secondaryMeta()}
      </div>
    </div>
  );
};

export default Title;
