---
title: "Sitemap"
permalink: /sitemap/
---

{% include base_path %}

<h1><i class="fa fa-list-ul" aria-hidden="true"></i>Pages</h1>
{% for post in site.pages %}
  {% include archive-single.html %}
{% endfor %}

<!--<h1>Posts</h1>
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}

{% capture written_label %}'None'{% endcapture %}

{% for collection in site.collections %}
{% unless collection.output == false or collection.label == "posts" %}
  {% capture label %}{{ collection.label }}{% endcapture %}
  {% if label != written_label %}
  <h1>{{ label }}</h1>
  {% capture written_label %}{{ label }}{% endcapture %}
  {% endif %}
{% endunless %}
{% for post in collection.docs %}
  {% unless collection.output == false or collection.label == "posts" %}
  {% include archive-single.html %}
  {% endunless %}
{% endfor %}
{% endfor %}-->