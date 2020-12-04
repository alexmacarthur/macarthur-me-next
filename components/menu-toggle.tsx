const MenuToggle = () => {
  const bars = (new Array(3) as any).fill();

  return (
    <ul className={`menu space-y-3`}>
      {bars.map((_bar, index) => {
        return (
          <li
            key={index}
            className={`h-1 w-12 bg-gray-700 rounded-sm transition-all menu-bar menu-bar-${index + 1}`}>
          </li>
        )
      })}
    </ul>
  )
}

export default MenuToggle;
