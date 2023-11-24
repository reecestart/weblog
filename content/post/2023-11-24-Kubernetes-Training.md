---
author: Reece
categories: Tech
comments: true
date: 2023-11-24T10:11:00+10:00
tags:
- Kubernetes
- k8s
- training
- Docker
- containers
- orchestration
- OpenShift
- AKS
- Azure
- EKS
- AWS
- Prometheus
- Linux
- GKE
- GCP
- Minikube
- Ubuntu
- KCNA
title: "Kubernetes Training"
url: /2023/11/24/kubernetes-training/
draft: false
description: "Kubernetes Training"
---

[![Training](/public/img/knowledge.webp "Photo by DALLE-2")](https://labs.openai.com)

Another Kubernetes post. This time just to conclude that I finished the Novice [Introduction to Kubernetes](https://learn.acloud.guru/course/introduction-to-kubernetes/dashboard) course on A Cloud Guru. It was good just to fill in some of the foundation gaps but was honestly across most of it already. But there's always those small little nuggets that you brush past or miss and for me, in this course, it was that putting multiple containers in the same Pod should only happen when they need to share resources.

In terms of the next courses I'll be going through the following thirteen Apprentice-level courses in order:

1. [Beginner’s Guide to Containers and Orchestration](https://learn.acloud.guru/course/f276f2aa-fb5e-4fc6-9c36-0dc674b95767/overview) (1.2hrs, Docker)
2. [Introduction to OpenShift](https://learn.acloud.guru/course/introduction-to-openshift/overview) (1.3hrs, Kubernetes)
3. [AKS Basics](https://learn.acloud.guru/course/aks-basics/overview) (1.4hrs, Azure)
4. [EKS Basics](https://learn.acloud.guru/course/eks-basics/overview) (2.1hrs, AWS)
5. [Kubernetes Quick Start](https://learn.acloud.guru/course/9a0082c5-5331-492d-a677-173c393a85f7/overview) (2.7hrs, Kubernetes)
6. [Deploying a Basic Kubernetes Cluster](https://learn.acloud.guru/course/afb6c362-8b95-407e-9ba2-a142d8d2ce96/overview) (3.5hrs)
7. [AIOps Essentials (Autoscaling Kubernetes with Prometheus Metrics)](https://learn.acloud.guru/course/a93f8a6b-64ee-4c44-902e-dbc56cec9abf/overview) (4.5hrs, Linux)
8. [Kubernetes Deep Dive](https://learn.acloud.guru/course/kubernetes-deep-dive/overview) (4.6hrs, Kubernetes)
9. [Hands-On GitOps](https://learn.acloud.guru/course/7174b900-cf14-45e9-8f42-52f153e00857/overview) (4.7hrs, Kubernetes)
10. [Kubernetes Essentials](https://learn.acloud.guru/course/2e0bad96-a602-4c91-9da2-e757d32abb8f/overview) (4.8hrs, Linux)
11. [Minikube in the Cloud on Ubuntu](https://learn.acloud.guru/course/4db79ca0-d22c-4baf-b446-08bcd41173c9/overview) (6hrs, Linux)
12. [Google Kubernetes Engine (GKE): Beginner to Pro](https://learn.acloud.guru/course/gke-beginner-to-pro/overview) (6.4hrs, GCP)
13. [Kubernetes and Cloud Native Associate (KCNA)](https://learn.acloud.guru/course/kubernetes-and-cloud-native-associate/overview) (10.7hrs, Kubernetes)

A lot of this will be recap for me (e.g. EKS, OpenShift, etc.) and there is quite a bit to get through. I've sorted them by course length. I'm to imagine there will be a fair bit of repetition as I go through the courses but as most know:

> When stimuli are learned by repetition, they are remembered better and retained for a longer time ([The CPD Certification Service 2022](https://cpduk.co.uk/news/importance-of-repetition-in-learning))

Also to note one of those last courses is on Minikube which I already have running on my MacBook and I intend to use my Intel NUC and Raspberry Pi to set up a cluster as well. There are a [couple](https://randomsecurity.dev/posts/kubernetes-intel-nuc/) [of](https://tightlycoupled.io/stormlight/) [blog](https://get-it-dev.medium.com/installing-kubernetes-with-microk8s-on-an-intel-nuc-running-ubuntu-4223fcb938ed) [posts](https://technotim.live/posts/low-power-cluster/) on the Intel NUC setup side I can follow. And more than enough from [the](https://ubuntu.com/tutorials/how-to-kubernetes-cluster-on-raspberry-pi#1-overview) [Raspberry](https://alexsniffin.medium.com/a-guide-to-building-a-kubernetes-cluster-with-raspberry-pis-23fa4938d420) [Pi](https://anthonynsimon.com/blog/kubernetes-cluster-raspberry-pi/) [side](https://picluster.ricsanfre.com/docs/home/). Ideally I would like to have both the NUC and the Pi in a cluster together and, if possible, adding the Minikube running on the Macbook but we will see how it goes.

I think that's about it for now, off to complete the courses.