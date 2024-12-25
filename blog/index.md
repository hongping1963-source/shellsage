---
layout: default
title: Blog
---

# ShellSage Blog

Welcome to the ShellSage blog! Here you'll find articles about command-line productivity, best practices, and ShellSage features.

## Latest Posts

{% for post in site.posts %}
  <article class="post-preview">
    <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
    {{ post.excerpt }}
  </article>
{% endfor %}

## Categories

- [Tutorials](/blog/category/tutorials)
- [Best Practices](/blog/category/best-practices)
- [Features](/blog/category/features)
- [Case Studies](/blog/category/case-studies)
- [Updates](/blog/category/updates)

## Subscribe

Stay updated with the latest ShellSage news and articles:

- [RSS Feed](/feed.xml)
- [GitHub Releases](https://github.com/hongping1963-source/shellsage/releases)
- [Twitter](https://twitter.com/shellsage)

## Contribute

Have an idea for a blog post? We'd love to hear from you!

- [Submit a Post](https://github.com/hongping1963-source/shellsage/issues/new?labels=blog)
- [Give Feedback](https://github.com/hongping1963-source/shellsage/discussions)
- [Share Your Story](https://github.com/hongping1963-source/shellsage/discussions/categories/show-and-tell)
