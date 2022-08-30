import { useRouter } from "next/router";
import { SITE_URL } from "../lib/constants";

const useCurrentUrl = () => {
  const router = useRouter();
  return `${SITE_URL}${router.asPath}`.replace(/\/$/, "");    
}

export default useCurrentUrl;
