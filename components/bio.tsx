const Bio = () => {
  return (
    <div className="flex md:flex-row md:items-center space-x-3 md:space-x-6">
      <div className="flex-none w-14 md:w-24">
        <img
          data-lazy-src="/avatar.jpg"
          src={"/avatar.jpg"}
          alt=""
          className="rounded w-20 md:w-32"
        />
      </div>

      <div className="-mt-1">
        <p className="prose">
          Alex MacArthur is a software developer working for Dave Ramsey in
          Nashville, TN. Soli Deo gloria.
        </p>
      </div>
    </div>
  );
};

export default Bio;
