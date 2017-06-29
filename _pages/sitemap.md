---
title: "Sitemap"
permalink: /sitemap/
header:
  overlay_image: /assets/images/header.jpg
  overlay_filter: rgba(0, 127, 255, 0.75)
excerpt: 'GRAPLE Sitemap'
author_profile: false
---

{% include base_path %}

<h1>Pages</h1>
{% for post in site.pages %}
  {% include archive-single.html %}
{% endfor %}

<h1>Posts</h1>
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
{% endfor %}