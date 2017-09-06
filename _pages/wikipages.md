---
title: "Wiki Pages"
permalink: /wikipages/
---

{% include base_path %}

<h1>Wiki Pages</h1>
{% for post in site.pages %}
  {% if post.url contains "wiki" %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}