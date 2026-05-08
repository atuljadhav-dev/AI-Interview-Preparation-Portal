/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://placementready.atuljadhav.tech',
	generateRobotsTxt: true,
	generateIndexSitemap: false, // Disable the default index sitemap
	sitemapSize: 7000,
	changefreq: 'daily',
	priority: 1,
	trailingSlash: false,
	exclude: [
		'/aptitude',
		'/aptitude/*',
		'/dashboard',
		'/email',
		'/feedback',
		'/feedback/*',
		'/home',
		'/resume',
		'/resume/*',
		'/interview',
		'/interview/*',
	],
	robotsTxtOptions: {
		policies: [
			{ userAgent: '*', allow: '/' },
			{ userAgent: 'Googlebot', allow: '/' },
			{ userAgent: 'Bingbot', allow: '/' },
		],
	},
};
