---
author: Reece
categories: Tech
comments: true
date: 2024-01-19T11:55:00+10:00
tags:
- GitHub Actions
- DevSecOps
title: "GitHub Actions"
url: /2024/01/19/github-actions/
draft: false
description: "GitHub Actions"
---

![DevSecOps](/public/img/DevSecOps.webp "DevSecOps")

Moving my local deployment process for [AltitudeCode](https://altitudecode.com.au) and this blog from local Makefile to use GitHub Actions as both the repositories are hosted there.

First step is putting the secrets for deploying (S3 Bucket, CloudFront distribution ID, IAM access key and secret key) into the Secrets for GitHub Actions in the repository.

Then create hugo-deploy.yml in .github/workflows. Mine looks something like this:

```
name: Deploy Hugo Site
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true
      - run: hugo
      - uses: jakejarvis/s3-sync-action@v0.5.1
        with:
          args: --acl public-read --follow-symlinks --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: 'us-east-1'  # or your AWS region
          SOURCE_DIR: 'public'
      - uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: 'us-east-1'
      - run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

Then push the commit and monitor.