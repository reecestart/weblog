---
author: reecestart
categories: Tech
comments: true
date: 2021-02-03T15:14:00+10:00
tags:
- Email
- Encryption
- 2FA
- MFA
- ProtonMail
- Zoho
- Domain
- Route 53
title: "ProtonMail"
url: /2021/02/03/protonmail/
draft: false
description: "A journey migrating to ProtonMail."
---

![ProtonMail Logo](/public/img/protonmail-logo.webp)

*"Dance like nobody is watching. Encrypt like everyone is.”* - Werner Vogels

After not that long of using Zoho I've come to not entirely love the Android app that you are forced to use. The user experience has gaps (like being unable to set new meetings as private, also when accepting an invitation the email doesn't auto-delete, little things like that). Also after a bit of thought I'm not totally fussed with using an unencrypted service for email so from a small survey of the market I've decided to go with [ProtonMail](https://protonmail.com/). This blog process will go through the process of **migrating from Zoho Mail to ProtonMail**.

# Let's get started

First I need an account on ProtonMail. I'll go with the PLUS account which gives you access to use your own domain.

![ProtonMail Plus](/public/img/protonmail-plus.webp)

Once you've signed up and made payment ProtonMail will create your account, generate keys and then log you in so you can set yourself up.

![ProtonMail Generate Keys](/public/img/protonmail-generate-keys.webp)

First thing is first, jump in and turn on Two-Factor Authentication.

![ProtonMail Two-Factor Authentication](/public/img/protonmail-two-factor-authentication.webp)

Simple QR code scan for [Authy](https://authy.com/) and we're away. Next head over to Domain and click Add Custom Domain.

![ProtonMail Custom Domain](/public/img/protonmail-custom-domain.webp)

You'll be asked to enter your domain name, then your ProtonMail password, then be asked to create a TXT record. I'm using [Amazon Route 53](https://aws.amazon.com/route53/) for my DNS. Once the TXT record is created play the wait for verification game. Important to note that the generic instructions of using an @ for the record name of the TXT record don't work for Route 53. I found [this KB article](https://protonmail.com/support/knowledge-base/dns-records-amazon-web-services/) which says to "*Enter your domain instead*" so I'm going to test that with my existing Zoho record i.e. add a new line to the existing record. And that worked quite quickly so ensure you're just using the blank domain name not using an @ for the hostname value.

Next add the email address I'll be moving over, and a signature block and enter the ProtonMail password.

Then select the encryption key. There are three options:

- High security RSA 2048-bit (Older but faster)
- Highest security RSA 4096-bit (Secure but slow)
- State-of-the-art X25519 (Modern, fastest, secure)

I saw there were some comments on [Reddit](https://www.reddit.com/r/ProtonMail/comments/bfoyus/help_custom_domain_encryption_keys_2048_vs_4096/) mentioning potential issues with cross-platform use of X25519 so I'll stick with 4096-bit for now.

![ProtonMail Encryption Keys](/public/img/protonmail-encryption-keys.webp)

Once that is done it is time to attend to the MX records, as well as SPF, DKIM and DMARC for proper email delivery.

![ProtonMail Domain Status](/public/img/protonmail-domain-status.webp)

First is the MX records, ProtonMail give you two separate records to add with different priority:

- mail.protonmail.ch (Priority: 10)
- mailsec.protonmail.ch (Priority: 20)

I've got the existing Zoho records which I will need to maintain during the cutover so there may be some difference in those priority values but the important thing is that *mail.protonmail.ch* is first, followed by *mailsec.protonmail.ch* then the Zoho MX records in terms of lowest priority value.

These is the existing MX [Record Set](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset.html) showing the three Zoho mail servers.

![Route 53 Zoho MX Records](/public/img/route-53-zoho-mx-records.webp)

Edit the record, bump up the existing Zoho mail servers and add in the ProtonMail servers.

![Edit MX Record](/public/img/edit-mx-record.webp)

Once that is done you can refresh your domain status to see MX light up in green.

![Refresh Domain Status](/public/img/refresh-domain-status.webp)

Next is setting up [SPF](https://datatracker.ietf.org/doc/rfc7208/) which is important so bad actors don't attempt to send email from your domain. It also lowers the chances emails you send are marked as SPAM by your recipients email service. For more info see this post on [How To use an SPF Record to Prevent Spoofing & Improve E-mail Reliability](https://web.archive.org/web/20150420105102/https://www.digitalocean.com/community/tutorials/how-to-use-an-spf-record-to-prevent-spoofing-improve-e-mail-reliability) by [Pablo Carranza](https://twitter.com/psczg?lang=en).

![ProtonMail SPF](/public/img/protonmail-spf.webp)

Jumping over to Route 53, edit the existing TXT record and add *include:_spf.protonmail.ch* to it after the v=spf1 for the existing Zoho SPF record. It is important not to set multiple SPF records or you return a *PermError* as detailed in this [DMARCLY blog post](https://dmarcly.com/blog/can-i-have-multiple-spf-records-on-my-domain).

![Route 53 SPF TXT Record](/public/img/route-53-spf-txt-record.webp)

Once that is done go back to the ProtonMail console and refresh the domain status to check SPF is set up correctly.

![SPF Domain Status](/public/img/spf-domain-status.webp)

Next is setting up DKIM. DKIM or [DomainKeys Identified Mail Signatures](https://tools.ietf.org/html/rfc6376) is "*an email authentication technique that allows the receiver to check that an email was indeed sent and authorized by the owner of that domain*" as [dmarc analyzer writes](https://www.dmarcanalyzer.com/dkim/). ProtonMail gives you three DKIM CNAME records to set.

![ProtonMail DKIM](/public/img/protonmail-dkim.webp)

Once in Route 53 create three CNAME records with the trailing period/full-stop/(.).

![Route 53 DKIM Records](/public/img/route-53-dkim-records.webp)

After those are set, go back to the ProtonMail console and refresh the domain checks to see DKIM light up in green. You'll also see an email from ProtonMail notifying you that DKIM has been set up.

![DKIM Domain Status](/public/img/dkim-domain-status.webp)

Next is setting up [DMARC](https://tools.ietf.org/html/rfc7489). DMARC is a type of anti-phishing feature designed to prevent bad actors from fraudulently sending emails appearing to be from your domain. [Rob Mueller](https://www.linkedin.com/in/robmuelleraus/) has a great blog post detailing the history of DMARC on the [Fastmail blog](https://fastmail.blog/2016/12/24/spf-dkim-dmarc/).

In the ProtonMail console you will be given the values of the TXT record you need to set. I'm going to set the reporting address (rua) and recommend receivers quarantine email not meeting SPF and DKIM.

![ProtonMail DMARC Setup](/public/img/protonmail-dmarc-setup.webp)

Set up the TXT record for DMARC as appropriate.

![ProtonMail DMARC Setup](/public/img/route-53-dmarc.webp)

Then back to the ProtonMail console to check the final status and should be all green.

![ProtonMail DMARC Setup](/public/img/final-protonmail-status.webp)

Once that is all done it is time to migrate existing mail from Zoho to ProtonMail. Looks like [Zoho supports exporting email into EML](https://www.zoho.com/mail/help/import-export-emails.html) and [ProtonMail supports importing from EML](https://protonmail.com/support/knowledge-base/how-to-import-emails-to-your-protonmail-account/) so that looks like the path to take. As [CloudHQ](https://support.cloudhq.net/what-is-eml-format/) writes: "*The EML format is the standard format used by many email programs. EML files are created to comply with industry standard [RFC 5322](https://tools.ietf.org/html/rfc5322).*"

First jump into [Zoho Mail](http://www.zoho.com/mail/login.html). Go to Settings. Then select Export History.

![Zoho Export Emails](/public/img/zoho-export-emails.webp)

It's at this point where you need to select each top level folder and export a certain duration of emails. I chose all time, for three folders Inbox and then two automatically created folders Zoho set up Newsletter and Notification. The export was quite quick.

![Zoho Export Manager](/public/img/zoho-export-manager.webp)

You will then be emailed, in ProtonMail, links to download the Zoho export .zip files.

![Zoho Export Links](/public/img/zoho-export-links.webp)

After clicking on these links you will be given another link to directly download the .zip file.

![Zoho Folder Export](/public/img/zoho-folder-export.webp)

The .zip file you download will contain all the .eml messages. Download each of the .zip files you need.

Once that is done you can begin importing into ProtonMail. Some things to note:

- Importing only appears to be a paid feature for ProtonMail
- When you import the emails they are immediately encrypted using 

First you need to download and install the [ProtonMail Import Export App](https://protonmail.com/import-export).  Then open the app, add your ProtonMail account which will log you in. Then once you are connected you can choose the email address to import into.

![ProtonMail Import Export](/public/img/protonmail-import-export.webp)

Select Import from local files, found the .zip file which you have exported to a folder containing the .eml files and select that folder. Once done click Import.

![Import Zoho Emails](/public/img/import-zoho-emails.webp)

Then watch as the encryption and importing process does its magic.

![ProtonMail Status Importing](/public/img/protonmail-status-importing.webp)

After the import is done check to see if there were any import errors, remediate if needed, and continue on to the rest of the .zip files.

![Import Completed Successfully](/public/img/import-completed-successfully.webp)

Next, I am going to export my calendar.

Similar area in the Zoho console, just go into Calendar, select the Calendar you wish to export and then download the .ics file.

![Zoho Export Calendar](/public/img/zoho-export-calendar.webp)

ProtonMail has it's own Calendar called [ProtonCalendar](https://protonmail.com/support/knowledge-base/import-calendar-to-protoncalendar/). Some things to note:

- It is currently in beta
- Again, it is a paid/subscription only service

To access the calendar first login to [beta.protonmail.com](beta.protonmail.com). Once there hit the drop-down menu to select ProtonCalendar.

![ProtonCalendar](/public/img/protoncalendar.webp)

This will open up a new tab and prompt you with your ProtonCalendar import screen. Click *Import your events*.

![Import Calendar Events](/public/img/import-calendar-events.webp)

Select your local .ics folder and click *Import*.

![ProtonCalendar Import .ics](/public/img/protoncalendar-import-ics.webp)

You should then have all your events imported.

Finally I moved onto Contacts. [ProtonContacts](https://www.google.com/search?client=firefox-b-e&q=protoncontacts) is the service. ProtonContacts supports importing either [.csv or .vcf](https://protonmail.com/support/knowledge-base/adding-contacts/). Export as .csv from Zoho, give it a password, export the .csv.zip using the password them import using ProtonContacts.

![ProtonContacts Import Zoho](/public/img/protoncontacts-import-zoho.webp)

Ensure you check the automatic field matching to ensure they align as best as possible.

And that's it. Finally go back to Zoho and clean up your account, delete everything, then remove the MX records and everything else from Route 53 and close your Zoho account. Happy encrypted emailing.