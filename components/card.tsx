type CardProps = {
  classes?: string,
  element?: string,
  children: React.ReactNode,
  [key: string]: any
}

const Card = ({
  classes,
  children,
  element = 'div',
  ...otherProps
}: CardProps ) => {
  const Element = element as any;
  const defaultClasses = "border-2 border-gray-200 rounded-lg p-6 md:p-8 ";

  return (
    <Element className={defaultClasses + classes} {...otherProps}>
      { children }
    </Element>
  )
}

export default Card;
