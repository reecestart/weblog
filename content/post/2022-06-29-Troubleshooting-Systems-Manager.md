---
author: Reece
categories: Tech
comments: true
date: 2022-06-29T12:16:00+10:00
tags:
- AWS Systems Manager
- Troubleshooting
- IAM
- Fleet Manager
title: "Troubleshooting Systems Manager"
url: /2022/06/29/troubleshooting-systems-manager/
draft: false
description: "Troubleshooting AWS Systems Manager"
---

[![Troubleshooting](/public/img/troubleshooting.webp "Photo by DALLE-2")](https://labs.openai.com)

[AWS Systems Manager](https://aws.amazon.com/systems-manager/) is a great service when it is working but sometimes it you can get yourself a little stuck trying to restrict access down when initially attempting to deploy and get your instances reporting as Managed Instances. Recently I was running an event where the Managed Instances weren't reporting in. I found the Instance Profile that the Instances were assuming didn't get deployed correctly and when I attempted to change the Instance Profile I received:

`The association iip-assoc-xxxxxxxx is not the active association`

I found [this article](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-resolve-active-assocation-error/) which helped me identify the associated IAM Roles, remove them, then add the new clean AmazonSSMManagedInstanceCore role. Now with the new role I still couldn't get them reporting in as Managed Instances. I went through the checklist:

1. SSM agent installed? I think so - using an AWS Managed AMI, albeit an old one.
2. Instance profile? Yep, I just created this and added it
3. Route to SSM endpoint + Security Groups? Yep, SG allow all outbound and private subnet route out through 0.0.0.0/0 to NAT Gateway.

I was stuck. Then I found [this troubleshooting article](https://aws.amazon.com/premiumsupport/knowledge-center/systems-manager-ec2-instance-not-appear/). Launching a similar instance with a keypair and opening SSH 22 and Elastic IP attached with IGW route I began to diagnose. The SSM agent was installed and running, that was good. I could reach the SSM endpoints. Asked to check the role is attached, yes it is I just created and added it. Can the instance reach it's instance metadata service, yep. Then the article recommends to check the SSM Agent Logs in /var/log/amazon/ssm. I tail the amazon-ssm-agent.log and see:


>2022-06-29 01:50:16 INFO [ssm-agent-worker] Entering SSM Agent hibernate - AccessDeniedException: User: arn:aws:sts::123456789012:assumed-role/AmazonSSMManagedInstanceCore/i-0a123bcd123ab is not authorized to perform: ssm:UpdateInstanceInformation on resource: arn:aws:ec2:eu-west-1:123456789012:instance/i-0a123bcd123ab because no identity-based policy allows the ssm:UpdateInstanceInformation action
	status code: 400, request id: ...

Something is wrong with the Instance profile. I go and check the IAM Role and sure enough when I tried to attach the managed AmazonSSMManagedInstanceCore policy I mustn't have clicked through all the screens and the IAM Role was empty with no permissions. After attaching the permissions and rebooting the instances they showed in the Managed Instances console:

[![Fleet Manager](/public/img/fleet-manager.webp "Managed Instances")](https://console.aws.amazon.com/systems-manager/managed-instances)