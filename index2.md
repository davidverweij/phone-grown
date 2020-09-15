---
layout: default

headerimage:
  alt: A drawing showing half rainy and half sunny weather. The halves are highlighted depending on the weather, using a phone placed behind the drawing
  url: "/assets/images/sunshine.jpg"
---

## About {#about}
Do you have an (old) unused smart phone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial. Show what you can make and support our research!

_This tutorial is developed by [David Verweij](https://openlab.ncl.ac.uk/people/david-verweij/){:target="_blank"} at Newcastle University as part of his PhD research, read more [here](#more-about)._

## What can it do? {#whatisit}
When you finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change based on some data that you choose. For example, the screen could turn _blue when you receive an email_ or _green when Wired.com publishes a new article_. Of course, just showing colours doesn't tell you what it means - that's where some pen and paper come handy. With a little drawing placed in front of the phone you give meaning to the colours. Since we have 'split' the screen into multiple areas, you can even show multiple things at the same time. For example, you could let the _left side turn blue when it will rain_, **and** the _right side turn yellow when the temperature is high_ (see also the image at the top). Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for!

[Check the video](#video){: .btn .btn-blue :target="_blank"}

## Tools & Materials you need {#materials}
- A smart phone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- Some pen and paper
- A computer/laptop to set things up
- A [Google account](https://myaccount.google.com/){:target="_blank"} (_for using Google Sheets_)
- An [IFTTT.com](https://www.ifttt.com/){:target="_blank"} account (_for connecting it to data_)

## Where to start? {#letsgo}
We're just testing the last bits of the tutorial and will publish the tutorial on the **28th of September 2020** latest. Check back again then, or get a notification when it is ready by clicking on the button below.

[Notify me when the tutorial is ready](https://forms.gle/DuNouDBeYJBhXBcDA){: .btn .btn-green target="_blank"}

## Share your creation! {#share}
Although the template in the tutorial was made as part of a research project, it is fully stand-alone, [private and secure](#more-safe), and publicly available for anyone to follow. In other words, we have no clue how people use it! Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for.

Let us know what you created by using the [I made it!](#imadeits){: .btn .btn-yellow target="_blank"} button [on the Instructables page](#instructable){:target="_blank"}!

## Join our research {#join}
Aside from being curious what you have created, we are also looking for families to interview about following this tutorial. We would like to hear what they've created and how they've put their smart display to use! To show our thanks, we are giving each participating family a small monetary reward. Interested, or questions? Contact the researcher at _d.verweij2[@]newcastle.ac.uk_ or read more [about this research](#more-study).

[Email David](mailto:d.verweij2@newcastle.ac.uk?subject=Phone%20Grown%20Research%20Tutorial&body=Hi%20David){: .btn .btn-purple}

<br/>
<br/>
<hr/>
<br/>

## More info {#more}

### About this research {#more-about}
As part of David's PhD, we explore how you can be creative with technology at home in a less-technical way. We thinks this is very important in a time where we have a lot of technology in the home, and they seem to be getting more complex by the day! We used to be able to manage our own products quite well, but we are becoming more dependent on others when it comes to these complex things. This includes calling service centres when there are issues, or having one of the family members becoming the main expert on the device. This is why we believe we should make technology more accessible, not just to make customers - like you - less dependent from manufacturers, but also to allow you and everyone in your family to gain control.

To understand how we can do this structurally, we started to develop and test different ideas. One idea we previously tested focused on using _creativity before skill_, which was quite successful in engaging more people in the household with technology. We now want to continue this idea and see how it works in a family setting. Due the current 2020 pandemic, we are doing so through a tutorial, which allows us to test our concept without endangering anyone. Besides, a tutorial is much easier to share publicly than a physical prototype, reaching more people who might be interested and want to give it a try! That is why we put extra effort in the design of the tutorial and the tools needed, to make it private and secure, yet easily scalable for a large group of people.

### The research study {#more-study}
Aside from being curious what you have created, we are also running a research study about this tutorial. In this study, we ask families to create a smart display following this tutorial _four times_, once each week. We would then like to hear how they got along, and how they've put their smart display to use! To do so, we will have two virtual interviews of ~1.5 hours - one at the beginning and one at the end - and keep in touch through weekly (and brief) video calls. We are looking for **UK-based families**  with at least one child living at home, and would like to **start on the 10th of October 2020**. To show our thanks, we are giving each participating family a monetary reward. Interested, or questions? Please contact the researcher at _d.verweij2[@]newcastle.ac.uk_.

[Email David](mailto:d.verweij2@newcastle.ac.uk?subject=Phone%20Grown%20Research%20Tutorial&body=Hi%20David){: .btn .btn-purple}

_This research has been approved by the Newcastle Ethics Committee on 21/08/2020 (ref: 20-VER-024) and as such follows strict guidelines for collecting and managing data, and ensuring safety and privacy of participants._

### The technology bit {#more-tech}
In the tutorial, you will be copying a Google Sheet to use as your own. Embedded in this Sheet 'document-bound' is a Google App Script (written in Javascript) that you can publish as a web app. This effectively creates a way to read and write data into the Google Sheet using standard web protocols, which is an approach used in some 'app making' services such [glide](https://www.glideapps.com/){:target="_blank"}. In the setup, your Google Sheet will also create an anonymous entry into our external database. This is fully anonymous and very lightweight (see [privacy and safety](#more-safe)), and is needed to make your phone respond quickly to changes in the Sheet - something your web app doesn't offer. Once you linked your phone to your own web app via the Phone Grown mobile webpage, it can retrieve instructions through your web app through its web-browser. By design, your web app only allows ([very specific](#more-safe)) information to be read from the Sheet. That is why when a 'rule' you set in the Google Sheet is triggered (e.g. it will start to rain), it will update your anonymous entry in the external database. The phone will notice that change, and ask for the latest instructions via your web app.

These 'rules' you can set in your copy of the Google Sheet are checked each time new data is added to the Sheet. Many online services can connect to Google Sheets. More specifically, they primarily do so by adding a new row to the Sheet when something happened, also called 'triggers'. This is the same for the Google Sheets integration with [IFTTT.com](https://ifttt.com/google_sheets){:target="_blank"} - which we use in this tutorial. Once you set up one or multiple 'triggers' from IFTTT, new rows are added to your Google Sheets. When that happens, the script embedded in your Sheet will (1) read it, (2) check if it triggers any of your rules set in the Sheet, and if so (3) update your anonymous entry in the external database so that (4) your phone will contact your web app to get the latest instructions.

If you are interested, you can find more details on [GitHub](https://github.com/davidverweij/phone-grown){:target="_blank"}.

### Privacy and safety {#more-safe}
We had three aims when we designed this tutorial. First, we want to help you create a smart display in such a way that you don't have to program or fiddle with complex tools. Second, you and your family should do this mainly yourself (DIY), to work together and have fun! And lastly, we wanted this to be standalone, being able to grow and evolve without us - or what others would call 'open source'. That is why we based our tutorial on existing, common and (hopefully) familiar tools. This way, you are in control over the tools, and in cases where some functionality is a bit hidden or complex, we made things as transparent as possible, read more [below](#more-safe-details). Aside from one 'dependency' (our external database, see also below), you have access to everything: your copy of the Google Sheet, the functionality that is attached to that via code, the IFTTT 'triggers' you set up and even the phone and its web browser. Compared to product you buy in-store, we think this approach is quite valuable and interesting, and would love to hear your thoughts on that. Of course, whilst we did our very best to be as transparent and clear as possible, we welcome any feedback, help and [contributions](#more-contr).

#### **Disclaimer** {#disclaimer}
Whilst we put a lot of effort in writing this tutorial, it remains an 'do-it-yourself' activity for which we cannot take any liability. It remains your responsibility to use this tutorial as you see fit, and in doing so, you understand that this comes without any warranty. We cannot be held liable for any claim, damage or other liability from following this tutorial or using the tools referred to. More details in our [MIT License](https://github.com/davidverweij/phone-grown/blob/master/LICENSE){:target="_blank"}, the terms of service of [Instructables.com](http://usa.autodesk.com/adsk/servlet/item?siteID=123112&id=21959721){:target="_blank"} and of [IFTTT.com](https://ifttt.com/terms){:target="_blank"}.


#### **You privacy and safety** {#more-safe-details}
Of course, while you might not need to do any programming, it doesn't mean some code is involved. _So how did we ensure your privacy and safety?_ To do so, we embedded almost all functionality in a Google Sheet - that you can copy. By copying it, you can access all aspects of the Sheet including the embedded code, which also prevents it from having any active connections to other services. Only when you 'publish' the embedded code as a web app, it becomes publicly accessible. In order to connect to your web app, you need to know the link to it, which only you know. Guessing it is will be very difficult. Even then, the code is written such that when something connects with your web app, it can only retrieve the phones instructions. These instructions include a time, duration and the colours for the background, no sensitive data at all. The only functionality that we were unable to embed in the Google Sheet, was a real-time connection between the phone an that Sheet. This is why your copy of the Google Sheet will connect to our own database hosted in West Europe. When it does, it will create a new anonymous 'user' for the database - which has very strict and elaborate security rules (see [here](https://github.com/davidverweij/phone-grown/tree/master/resources#firestore-rules){:target="_blank"}). In short, only the anonymous 'user' can store something in this database, and this can only be one single number, no more no less. Each time your script connects with that database it will authenticate itself with a complex name and even more complex password only your script knows, which is updated each hour as is standard protocol. Reading from this database can however be done without authentication, but only if you know the complex name of your anonymous 'user'. Even then, it only stores a single number, again no sensitive data at all.

Of course, we depend on incoming data sources, such as IFTTT.com which we use in this tutorial. Whilst we did our best to ensure your privacy and safety, we have no control over their services. // TODO: [IFTTT.com](https://ifttt.com/terms){:target="_blank"} has some

More details of what the code is and what it does can be found [here](https://github.com/davidverweij/phone-grown){:target="_blank"}, a public copy of the code used in the Google Sheet template.



database:
> Most phones do not receive security updates after ~3 years<sup>*</sup> and become vulnerable for security breaches and 'hacks'. If you are not using the phone for any other purposes, we suggest to 'factory reset' your phone. __This will delete all files, apps and data on the phone__, and can often be done from the phone's `Settings` menu. Whether you did a factory reset or not, it is always good practice to update the software and security updates to the latest version (as far as it goes). Here is how to do that for [Android](https://support.google.com/android/answer/7680439?hl=en-GB) or [iOS](https://support.apple.com/en-gb/HT204204).

> _<sup>*</sup> For iOS devices this is roughly after 5 year since its release, for Android this is often shorter (~3 years). You can read more about [the safety of using older phones here](https://www.tomsguide.com/uk/us/old-phones-unsafe,news-24846.html?region-switch=1593506477)._
</details>

<!--

-->

### Sustainability {#more-sust}
Keeping your screen on all the time will undoubtedly increase the power usage of your phone. In addition to that, the processor is not going to sleep. This is different from the modern screensavers on phones, as they use processing power and energy intelligently. Unfortunately, since we use older phones and a website instead of an app, we cannot use this approach. Instead, this tutorial requires you to keep the phone on a charger, similar to how you would Chargers that are not charging use almost no energy. However, leaving your phone on the charger at all times is not the best treatment for the longevity of your battery. This should be fine when using an older, obsolete, phone, but might not be best if you are using a modern phone for this tutorial in the long run.

A rough calculation (2kWh, < €1/£1 per year)
Let's take a 'new' Samsung Galaxy S6 (2015) with a battery of 2550 mAH (3.85V). If the phone would be fully drained (and charged) each day, it would take up to 5.5 Wh, or 2 kWh per year. With a current average energy cost of less than €0,30 / £0,30 per kWh, it would cost no more than one euro or pound each year.

### Contributing {#more-contr}
We are always looking for ways to improve our work and we welcome any suggestions, tools or tips about the tutorial. You can leave feedback on the [Instructables.com](#instructablescom){:target="_blank"} page, contact me at d.verweij2[@]newcastle.ac.uk or visit this project on [GitHub](https://github.com/davidverweij/phone-grown){:target="_blank"}.
