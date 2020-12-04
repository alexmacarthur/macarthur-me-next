import Link from 'next/link'

const Pagination = ({previousPage = null, nextPage = null, currentPage, totalPages}) => {

  const disabledClasses = 'pointer-events-none opacity-50';

  return (
    <div className="flex flex-col items-center justify-center mt-20">

      <hr className="border-0 block h-1 w-20 bg-purple-400 mb-4" />

      <span className="block mt-1 mb-2 text-base">
        {currentPage} of {totalPages}
      </span>

      <ul className="flex space-x-3">
          <li>
            <Link href={`/posts/page/${previousPage}`}>
              <a className={`${previousPage ? '' : disabledClasses} text-base font-light`}>Back</a>
            </Link>
          </li>

          <li>
            <Link href={`/posts/page/${nextPage}`}>
            <a className={`${nextPage ? '' : disabledClasses} text-base font-light`}>Next</a>
            </Link>
          </li>
      </ul>
    </div>
  )
}

export default Pagination;
