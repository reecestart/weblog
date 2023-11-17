---
author: Reece
categories: Tech
comments: true
date: 2023-11-17T11:10:00+10:00
tags:
- Kubernetes
- k8s
- security
title: "Kubernetes"
url: /2023/11/17/kubernetes/
draft: false
description: "Kubernetes"
---

[![Container Orchestration](/public/img/container-orchestration.webp "Photo by DALLE-2")](https://labs.openai.com)

I recently started getting a bit more hands on with Kubernetes first by going through A Cloud Guru's Introduction to Kubernetes course. Haven't fully finished it so far but was good to get an understanding and get hands on setting a cluster up from scratch, what packages are required and what ports are required to be open from the control plane and member nodes. Previously most of my use of Kubernetes had been with [EKS](https://aws.amazon.com/eks/) which obviously the benefit is that EKS provisions and manages the control plane for you.

Short update post but I'll be focusing a lot more on Kubernetes with particular focus on security of Kubernetes clusters and application development pipelines using Kubernetes to deploy to. A few reasons for this, firstly I've seen first-hand multiple large customer projects deploying to managed Kubernetes services for key business workloads. And secondly, from talking with industry leaders like Sysdig and Wiz (just read Wiz' [Kubernetes Security Report 2023](https://www.wiz.io/lp/the-2023-kubernetes-security-report)) that this is a complicated area with low maturity.

Till then.