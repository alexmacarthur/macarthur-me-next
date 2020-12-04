import DateFormatter from "./date-formatter";
import Button from "./button";

type TitleProps = {
  children: React.ReactNode,
  date?: string,
  isPost?: boolean,
  subtitle?: string
}

const Title = ({children, date, isPost, subtitle}: TitleProps) => {
  return (
    <div className="mt-1 lg:mt-6 mb-6 lg:mb-12">

      <div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-2 gradient-text inline-block leading-none">
          {children}
        </h1>

        {subtitle &&
          <h2 className="font-light text-2xl italic text-gray-500">
            {subtitle}
          </h2>
        }
      </div>

      { isPost &&
        <span className="inline-block mb-3 mr-4 text-base">
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
      }

      {date &&
        <DateFormatter dateString={date} />
      }
    </div>
  )
}

export default Title;
