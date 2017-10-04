---
title: "Wiki Pages"
permalink: /wikipages/
header:
  overlay_color: "#3C829B"
---

{% include base_path %}

<h1><i class="fa fa-list-ul" aria-hidden="true"></i>Wiki Pages</h1>
{% for post in site.pages %}
  {% if post.url contains "/wiki/" %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}