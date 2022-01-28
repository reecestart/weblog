---
author: reecestart
categories: Tech
comments: true
date: 2022-01-15T00:12:00+10:00
tags:
- Subdomain
- Domain
- Migration
- Route 53
- CloudFront
- S3
title: "Subdomain"
url: /2022/01/15/subdomain/
draft: false
description: "Migrating blog to a subdomain"
---

[![Subdomain](/public/img/subdomain.webp "Photo by Miroslav Škopek on Unsplash")](https://unsplash.com/@skopekmiroslav)

No real relevance for that photo but thought it looked good. This post, which I started once before and since lost, has been in the making for some time. Migrating the blog from its current domain down to subdomain i.e. blog.denne.com.au

I've already done some things so I'm going to try and piece that together. So this is what I can see I have already done:

1. I've created the blog.denne.com.au hosted zone in Route 53
2. There's an NS record set pointing in the denne.com.au hosted zone pointing to the nameservers for the blog.denne.com.au hosted zone
3. I've create a blog.denne.com.au and www.blog.denne.com.au S3 buckets
4. The denne.com.au and blog.denne.com.au S3 buckets are sync'd and both are enabled for static website hosting
5. There is no bucket policy for blog.denne.com.au indicating an OAI for CloudFront and no CloudFront distributions for the subdomain so that looks like the next step

But first - set the redirect requests for an object to blog.denne.com.au in the static website hosting section for www.blog.denne.com.au for https.

Next, create the two new distributions. I've written abotu these steps earlier best to check out the [Domain](https://denne.com.au/2020/10/27/domain/) post. Longest part was the DNS validation for the ACM certificate.

Then create a few A record alias' to the two CloudFront distributions and ready to go.

![blog.denne.com.au](/public/img/blogdennecomau.webp)

Then just to clean-up the old page which I'll do tomorrow.