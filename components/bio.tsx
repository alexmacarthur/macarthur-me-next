import Image from "./image";

const Bio = () => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-3 md:space-x-6 mt-16">
      <div className="flex-none w-20 md:w-24 flex items-center justify-center md:justify-start">
        <Image 
          src="/avatar.jpg"
          alt="my face"
          classes="rounded w-16 md:w-20"
          width="80"
          height="80"
        />
      </div>

      <div className="-mt-1">
        <p className="prose text-center md:text-left">
          Alex MacArthur is a software developer working for Dave Ramsey in
          Nashville, TN. Soli Deo gloria.
        </p>
      </div>
    </div>
  );
};

export default Bio;
