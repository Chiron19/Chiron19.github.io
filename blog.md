---
layout: page
title: Blog
permalink: blog
---

<style>
  .blog_title_block {
    text-decoration: none;
  }

  .blog_title_block:hover {
    h3 {text-decoration: underline;}
  }
</style>

<div style="display:flex; flex-direction:column; align-items:center; ">
<div style="width: fit-content;">
  {% for post in site.posts %}
  <a class="blog_title_block" href="{{site.baseurl}}{{ post.url }}">
    <div class="py-1">
      <h3>{{post.title}}</h3>
      <div class="text-sm text-gray-400">{{post.date | date: "%B %-d, %Y"}}</div>
    </div>
  </a>
  {% endfor %}
</div>
</div>
