import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { webpackBundler } from '@vuepress/bundler-webpack'

export default defineUserConfig({
  lang: 'zh-CN',

  title: '彼岸樱速',
  description: '欢迎来到bays的笔记文档空间',

  theme: defaultTheme({
    logo: '/logo.png',

    navbar: [
      '/',
      {
        text: '梦起',
        link: 'https://bianyingsu.github.io',
      },
      {
        text: 'Article',
        link: '/article/',
      },
      {
        text: 'Category',
        link: '/category/',
      },
      {
        text: 'Tag',
        link: '/tag/',
      },
      {
        text: 'Timeline',
        link: '/timeline/',
      },
    ],
    sidebar: {
      '/guide/': [
        '/guide/activeMQ.md',
        '/guide/arthas.md',
        '/guide/awt.md',
        '/guide/docker.md',
        '/guide/dubbo.md',
        '/guide/elasticsearch.md',
        '/guide/etcd.md',
        '/guide/excel.md',
        '/guide/git.md',
        '/guide/hibernate.md',
        '/guide/idea.md',
        '/guide/IO.md',
        '/guide/java-base.md',
        '/guide/Java工具.md',
        '/guide/Java面试.md',
        '/guide/jenkins.md',
        '/guide/JVM.md',
        '/guide/K8S.md',
        '/guide/kafka.md',
        '/guide/linux.md',
        '/guide/maven.md',
        '/guide/memcache.md',
        '/guide/mybatis.md',
        '/guide/mysql.md',
        '/guide/nacos.md',
        '/guide/nginx.md',
        '/guide/rabbitMQ.md',
        '/guide/redis.md',
        '/guide/rocketMQ.md',
        '/guide/Sort.md',
        '/guide/spring.md',
        '/guide/SpringCloud.md',
        '/guide/Struts.md',
        '/guide/Thread.md',
        '/guide/tomcat.md',
        '/guide/xxl-job.md',
        '/guide/zookeeper.md',
        '/guide/信息安全.md',
        '/guide/分库分表.md',
        '/guide/协议.md',
        '/guide/各种框架.md',
        '/guide/吉他.md',
        '/guide/智力题.md',
        '/guide/科目一.md',
        '/guide/算法.md',
        '/guide/类型转换.md',
        '/guide/计算机网络.md',
        '/guide/设计模式.md',
        '/guide/锁机制.md',
        '/guide/集合框架.md',
      ],
    },

    sidebarDepth: 0,
  }),

  plugins: [
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: 'Categories',
            sidebar: true,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: true,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: 'Tags',
            sidebar: true,
          }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: true,
          }),
        },
      ],

      type: [
        {
          key: 'article',
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: 'Articles',
            sidebar: true,
          }),
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: 'Timeline',
            sidebar: true,
          }),
        },
      ],
      hotReload: true,
    }),
  ],

  bundler: webpackBundler(),
})
