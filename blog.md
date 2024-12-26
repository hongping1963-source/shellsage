---
layout: default
title: Blog
permalink: /blog/
---

# Latest Posts

{% for post in site.posts %}
<div class="post-preview">
    <h2>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h2>
    <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    {% if post.excerpt %}
    <div class="post-excerpt">
        {{ post.excerpt }}
    </div>
    {% endif %}
    <a href="{{ post.url | relative_url }}" class="read-more">Read More →</a>
</div>
{% endfor %}

<style>
.post-preview {
    margin-bottom: 2em;
    padding-bottom: 1em;
    border-bottom: 1px solid #eee;
}

.post-preview:last-child {
    border-bottom: none;
}

.post-date {
    color: #666;
    font-size: 0.9em;
}

.post-excerpt {
    margin: 1em 0;
}

.read-more {
    display: inline-block;
    padding: 0.5em 1em;
    color: #fff;
    background-color: #2c3e50;
    text-decoration: none;
    border-radius: 3px;
}

.read-more:hover {
    background-color: #34495e;
    text-decoration: none;
}
</style>
