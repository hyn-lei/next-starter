/** @type {import('next-sitemap').IConfig} */

const { createDirectus, readItems, rest } = require("@directus/sdk");

const directus = createDirectus("https://headless-cms.com").with(
  rest({
    onRequest: (options) => {
      // options.cache = 'no-cache'
      options.next = { revalidate: 30 };
      return options;
    },
  })
);

// Fetch data for SEO optimization
async function getPost(slug) {
  try {
    let data = await directus.request(
      readItems("post", {
        filter: { slug: decodeURIComponent(slug) },
        fields: ["title", "slug", "date_updated"],
      })
    );
    return data[0];
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = {
  siteUrl: "https://saas-service.com",
  generateRobotsTxt: true,
  changeFrequency: "weekly",
  priority: 0.7,
  // Specify output directory
  outDir: "./public",
  // Exclude unnecessary paths
  exclude: [
    "/api/*",
    "/admin/*",
    "/_next/*",
    "/server-sitemap.xml", // Exclude server-side sitemap
    "/preview/*",
  ],
  // Add alternative links for multi-language and static pages
  additionalPaths: async (config) => {
    const staticPages = [
      "/",
      "/blog",
      "/contact",
      "/converter",
      "/explore",
      "/privacy",
      "/terms",
    ];

    const locales = ["", "/zh", "/de", "/es", "/pt", "/ja"];
    const allPaths = [];

    // Generate page paths for each locale
    for (const locale of locales) {
      for (const page of staticPages) {
        const fullPath = locale + page;
        allPaths.push(await config.transform(config, fullPath));
      }
    }

    // Try to fetch blog posts
    try {
      console.log("Fetching blog posts from Directus...");
      const posts = await directus.request(
        readItems("post", {
          fields: ["slug", "date_updated"],
          limit: 100, // Limit fetch count
        })
      );

      console.log(`Found ${posts.length} blog posts`);

      // Add paths for each blog post and locale
      for (const post of posts) {
        for (const locale of locales) {
          const blogPath = `${locale}/blog/post/${post.slug}`;
          allPaths.push(await config.transform(config, blogPath));
        }
      }
    } catch (error) {
      console.warn("Failed to fetch blog posts:", error.message);
      // Continue generating other pages if blog posts fetch fails
    }

    return allPaths;
  },
  transform: async (config, path) => {
    console.log("Processing path:", path);
    let processedPath = path;

    // Handle /en prefix
    if (path.startsWith("/en")) {
      processedPath = path.replace("/en", "");
      if (processedPath === "") {
        processedPath = "/";
      }
    }

    // Handle blog posts
    if (processedPath.startsWith("/blog/post/")) {
      const slug = processedPath.replace("/blog/post/", "");
      try {
        const post = await getPost(slug);

        if (post) {
          return {
            loc: processedPath,
            lastmod: post.date_updated || new Date().toISOString(),
            changefreq: "weekly",
            priority: 0.8,
          };
        }
      } catch (error) {
        console.error(`Error processing blog post ${slug}:`, error);
      }
    }

    return {
      loc: processedPath,
      changefreq: config.changefreq || "weekly",
      priority: config.priority || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
