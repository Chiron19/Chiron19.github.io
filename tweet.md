---
layout: page
title: Timeline
permalink: tweet
---

<div>
<h3>🎉歡迎來到我的時間線！</h3>
<p>這裡存放了許多想說的話，也許是囉嗦的日誌，或者小短文，可以說是雜七雜八的隱藏面吧。總之，我希望記錄下來，希望可以將它填充得長長的，充滿刷不到底但值得回憶的故事。</p>
</div>

<div>
  {% for tweet in site.tweets %}
    <div class="py-1">
      <div class="text-sm text-gray-400">{{tweet.date | date: "%B %-d, %Y"}}</div>
      <div class="pt-4 px-4 prose prose-{{site.theme-color}}">
        {{tweet.content}}
      </div>
      {% unless forloop.last %}
      <div class="relative my-8 absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-200"></div>
      </div>
      {% endunless %}
    </div>
  {% endfor %}
</div>