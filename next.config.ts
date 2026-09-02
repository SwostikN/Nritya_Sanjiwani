import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* /contact was its own page until the details moved onto /partner,
     which is where the enquiry form already was. Kept as a redirect so
     bookmarks and anything already shared still land somewhere. */
  async redirects() {
    return [{ source: "/contact", destination: "/partner", permanent: true }];
  },
};

export default nextConfig;
