const Bio = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:space-x-6">
      <div className="mb-3 md:mb-0">
        <img
          data-lazy-src="/avatar.jpg"
          src={"/avatar.jpg"}
          alt=""
          className="rounded w-20 md:w-32" />
      </div>

      <div>
        <p className="prose">
          Alex MacArthur is a software developer working for Dave Ramsey in Nashville, TN. Soli Deo gloria.
        </p>
      </div>
    </div>
  )
}

export default Bio;
