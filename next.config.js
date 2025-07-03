// next.config.js
const nextConfig = { experimental: { runtime: "experimental-edge" } };
module.exports = {
  // experimental: {
  //   runtime: 'experimental-edge',
  // },
  // reactStrictMode: true,
  // swcMinify: true,
  experimental: { runtime: "experimental-edge" },
  images: {
    loader: "akamai",
    path: "",
  },
  //   security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          //Allow-Same-Origin
          {
            key: "Allow-Same-Origin",
            value: "true",
          },
          // allow access from https://denb1qwtms1e4.cloudfront.net, https://fonts.googleapis.com, mi-backend.qci.solutions
          {
            key: "Access-Control-Allow-Origin",
            value: "https://madeinindia.qcin.org,https://staging.madeinindia.qcin.org,https://fonts.gstatic.com",
          },
          // referrer policy allow access from https://denb1qwtms1e4.cloudfront.net, https://fonts.googleapis.com, mi-backend.qci.solutions
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
          // script-src 'self' 'unsafe-inline' https://fonts.googleapis.com
          // font-src 'self' https://fonts.gstatic.com
          // img-src 'self' data: https://denb1qwtms1e4.cloudfront.net https://fonts.gstatic.com
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.google.com/recaptcha/api.js https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://denb1qwtms1e4.cloudfront.net https://fonts.gstatic.com https://qci-dataorc-prod-s3-ap-south-1-mii-media-assets.s3.ap-south-1.amazonaws.com https://qci-dataorc-dev-s3-ap-south-1-mii-media-assets.s3.ap-south-1.amazonaws.com; frame-src 'self' https://www.google.com https://denb1qwtms1e4.cloudfront.net https://fonts.googleapis.com; connect-src 'self' https://denb1qwtms1e4.cloudfront.net https://mi-backend-staging.qci.solutions https://mi-backend.qci.solutions https://fonts.googleapis.com https://qci-dataorc-prod-s3-ap-south-1-made-in-india.s3.amazonaws.com https://qci-dataorc-dev-made-in-india.s3.amazonaws.com; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};
