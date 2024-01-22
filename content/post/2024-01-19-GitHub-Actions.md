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

```yaml
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

      - name: Set up Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build Hugo Site
        run: hugo -d output
      
      - name: Install Tidy
        run: sudo apt-get install -y tidy

      - name: Validate HTML with Tidy (Warnings Non-Fatal)
        run: |
          find output/ -name '*.html' -exec tidy -e -q {} \; || true

      - name: Find Latest Markdown File and Validate Corresponding HTML
        run: |
          MD_FILE=$(git log -1 --pretty=format: --name-only | grep '\.md$')
          if [ -z "$MD_FILE" ]; then
            echo "No markdown file found in the latest commit."
            exit 1
          fi
          HTML_FILE=$(echo $MD_FILE | sed 's|content/||; s|\.md$|.html|')
          HTML_PATH="output/${HTML_FILE}"
          echo "Checking HTML file: $HTML_PATH"
          if [ ! -f "$HTML_PATH" ]; then
            echo "HTML file does not exist: $HTML_PATH"
            exit 1
          fi
          CONTENT_TO_CHECK=$(sed -n '5p' $MD_FILE)
          if grep -q "$CONTENT_TO_CHECK" "$HTML_PATH"; then
            echo "Content found in HTML file."
          else
            echo "Content not found in HTML file."
            exit 1
          fi

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-southeast-2

      - name: Sync to S3
        run: aws s3 sync output/ s3://${{ secrets.AWS_S3_BUCKET }} --region ap-southeast-2 --delete

      - name: Invalidate CloudFront Distribution
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths / /archives/ /about/ /categories/ /feed.xml
```

Then push the commit and monitor. Note your region and Hugo output directory may be different.
