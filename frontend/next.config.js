/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
}

module.exports = nextConfig

// Enable packages in the list to be able to include CSS files (not supported with NextJS)
/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")([
    "@fullcalendar/common",
    "@babel/preset-react",
    "@fullcalendar/common",
    "@fullcalendar/daygrid",
    "@fullcalendar/interaction",
    "@fullcalendar/react",
    "@fullcalendar/timegrid",
]);

module.exports = withTM({});
