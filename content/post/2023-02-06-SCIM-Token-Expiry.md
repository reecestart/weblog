---
author: Reece
categories: Tech
comments: true
date: 2023-02-06T10:29:00+10:00
tags:
- AWS IAM Identity Center
- SSO
- SCIM
- Azure AD
- iDP
- Access Token
- Expiry
title: "SCIM Token Expiry"
url: /2023/02/06/scim-token-expiry/
draft: false
description: "SCIM Token Expiry"
---

[![Token Expiry](/public/img/token-expiry.webp "Photo by DALLE-2")](https://labs.openai.com)

I have been getting this alert for the past couple of weeks that my SCIM Access Token is approaching expiration. SCIM = protocol for System for Cross-domain Identity Management. It is used to automatically provision users and groups from my Identity Provider (iDP), in this case Azure AD, to IAM Identity Centre formerly AWS SSO.

So let's take a look at the token.

Note that "[An IAM Identity Center directory supports up to two access tokens at a time](https://docs.aws.amazon.com/singlesignon/latest/userguide/provision-automatically.html?icmpid=docs_sso_console#rotate-token)".

Note, also, that there is no API to automate the SCIM token generation, you need to use the console.

[![SCIM Access Token](/public/img/scim-access-token.webp "SCIM Access Token")](https://ap-southeast-2.console.aws.amazon.com/singlesignon/identity/home)

Note down the token ID that you want to rotate.

Generate your new access token.

[![Generate New Token](/public/img/generate-new-token.webp "Generate New Token")](https://ap-southeast-2.console.aws.amazon.com/singlesignon/identity/home)

Then you need to go update your iDPs SCIM settings. In my case Azure AD. Go into the [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/ManageProvisioning/), under Enterprise Applications select AWS Single-Sign-on and then under Manage select Provisioning and then click Update Credentials.

[![Update Credentials](/public/img/update-credentials.webp "Update Credentials")](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/ManageProvisioning/)

Expand the Admin Credentials drop-down and under Secret Token paste the new access token you received from Identity Center and then click the Test Connection button to check everything is working.

[![Update Secret Token](/public/img/update-secret-token.webp "Update Secret Token")](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/ManageProvisioning/)

[![Testing Connection](/public/img/testing-connection.webp "Testing Connection")](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/ManageProvisioning/)

Once your test is successful click Save.

[![Save Provisioning Settings](/public/img/save-provisioning-settings.webp "Save Provisioning Settings")](https://portal.azure.com/#view/Microsoft_AAD_IAM/ManagedAppMenuBlade/~/ManageProvisioning/)

Then you can go back into AWS IAM Identity Center and delete the old expiring access token.

[![Delete Access Token](/public/img/delete-access-token.webp "Delete Access Token")](https://ap-southeast-2.console.aws.amazon.com/singlesignon/identity/home)

And that's it.