---
author: reecestart
categories: Tech
comments: true
date: 2020-11-24T10:35:51+10:00
tags:
- AWS Network Firewall
- VPC
- Routing
- Security
title: "AWS Network Firewall"
url: /2020/11/24/aws-network-firewall/
description: "An overview of the deployment of the AWS Network Firewall."
---

Looks like a new release called the [AWS Network Firewall](https://aws.amazon.com/about-aws/whats-new/2020/11/introducing-aws-network-firewall/) which is:

- a new managed service
- lets you deploy network security across your Amazon VPCs with just a few clicks

Here is the [announcement](https://aws.amazon.com/blogs/aws/aws-network-firewall-new-managed-firewall-service-in-vpc/), the [overview page](https://aws.amazon.com/network-firewall/), and a [blog post](https://aws.amazon.com/blogs/networking-and-content-delivery/deployment-models-for-aws-network-firewall/).

It exists within the VPC console. It took me a few minutes after creating the Firewall for it to be provisioned and Ready. From there you create your Stateless rule groups with rules to either pass, drop or forward to stateful rules. Then create your Stateful rule group which you can use either 5-tuple, Domain list or [Suricata compatible IPS rules](https://suricata-ids.org/).

There are a couple of [Architecture Diagrams](https://docs.aws.amazon.com/network-firewall/latest/developerguide/architectures.html) based on if you are using NAT, not using NAT, single or multi-AZ in the docs.

At this point it took me a little to work out which subnets and route tables I needed to set up. So the Network Firewall exists, for me at least, in two subnets (two AZs) and those subnets shouldn't have anything else existing in them it seems. I created these in /20 subnets which was a little overkill. Fortunately it appears you can modify the subnets for the Network Firewall on the fly you just need to ensure you only have one subnet associated with a particular AZ at a point in time otherwise you'll get the below error:

![Network Firewall Subnet Change](/public/img/network-firewall-subnet-change.webp)

So I created two /28's and swapped them around. During this process the Firewall endpoint status for each AZ was *Deleting* and the Firewall status was *Provisioning*.

Eventually had the three subnets per AZ, one for the Network Firewall, one for the NAT Gateway, and one for the workloads.

![Network Firewall Subnets](/public/img/Firewall-Subnets.webp)

**Note:** The Firewall is presented as a VPC Endpoint when you are updating your route tables i.e. it is prefaced with vpce- and listed under *Gateway Load Balancer Endpoints*.

![Gateway Load Balancer Endpoint](/public/img/Gateway-Load-Balancer-Endpoint.webp)

At this point I launched an Amazon Linux 2 Instance in the Customer/Private subnet in -1a and once it passed the Status checks I went to look at the Monitoring tab on the Network Firewall Manager. You can see the packets received and packets passed for the Stateless Rule Group.

![Requests Monitoring](/public/img/Requests-Monitoring.webp)

![6 1/2 Hours Later](/public/img/six-and-a-half-hours-later.webp)

Okay so looks like I overlooked something in the architecture diagram. It appears you need to use [Amazon VPC Ingress Routing](https://aws.amazon.com/about-aws/whats-new/2019/12/amazon-vpc-ingress-routing-insert-virtual-appliances-forwarding-path-vpc-traffic/) for this to work properly. I was missing that on the diagram. In order to do this you need to create a Route Table for the IGW and associate it. This route table specifically has the NAT Gateway Subnets directed to the VPC Endpoints for the Network Firewall (duh!).

From there I connected via SSH onto my Jumpbox in the NAT/Protected subnet and then I connected via SSH to the Customer/Private subnet EC2 Instance. Then installed Apache to test somme things. After implementing a Stateless Rule to drop Port 22 (SSH)...

![Stateless Drop SSH](/public/img/stateless-drop-SSH.webp)

My SSH connection dropped.

![Broken Pipe](/public/img/client-loop-send-disconnect-Broken-pipe.webp)

Jumping into CloudWatch Metrics is a bit easier to see dropped packets info.

![CloudWatch Metrics](/public/img/cloudwatch-metrics.webp)

**Summary**

In summary this looks like another string to the bow of cloud network architecture options and with the combination of CloudWatch Metrics and CloudWatch Logs Insights you should be able to create some very visible near-real-time dashboards for what is happening in your environment.
