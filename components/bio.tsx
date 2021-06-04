const Bio = () => {
  return (
    <div className="flex md:flex-row md:items-center space-x-3 md:space-x-6 mt-16">
      <div className="flex-none w-20 md:w-24">
        <img
          data-lazy-src="/avatar.jpg"
          src={"/avatar.jpg"}
          alt="my face"
          className="rounded w-16 md:w-20"
        />
      </div>

      <div className="-mt-1">
        <p className="prose mb-4">
          Alex MacArthur is a software developer working for Dave Ramsey in
          Nashville, TN. Soli Deo gloria.
        </p>
      </div>
    </div>
  );
};

export default Bio;
