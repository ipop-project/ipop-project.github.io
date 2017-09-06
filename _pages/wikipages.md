---
title: "Wiki Pages"
permalink: /wikipages/
---

{% include base_path %}

<h1><i class="fa fa-list-ul" aria-hidden="true"></i>Wiki Pages</h1>
{% for post in site.pages %}
  {% if post.path contains "/wiki/" %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}