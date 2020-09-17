---
layout: default

headerimage:
  alt: A drawing showing half rainy and half sunny weather. The halves are highlighted depending on the weather, using a phone placed behind the drawing
  url: "/assets/images/sunshine.jpg"
---

## About {#about}
Do you have an (old) unused smartphone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial. Show what you can make and support our research!

_This tutorial is developed by [David Verweij](https://openlab.ncl.ac.uk/people/david-verweij/){:target="_blank"} at Newcastle University as part of his PhD research, read more [here](#more-about)._

## What can it do? {#whatisit}
When you finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change colour based on some data that you choose. For example, the screen could turn _turn blue on the left when it will rain_, and _turn yellow on the right when the temperature is high_ (see also the picture at the top). Now, when you add a little drawing in front of your phone it shows you, and anyone else at home, what the colours mean.

Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for!

<!-- [Check the video](#video){: .btn .btn-blue target="_blank"}-->

## Tools & Materials you need {#materials}
- A smartphone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- Some pen and paper
- A computer/laptop to set things up
- A [Google account](https://myaccount.google.com/){:target="_blank"} (_for using Google Sheets_)
- An [IFTTT.com](https://www.ifttt.com/){:target="_blank"} account (_for connecting it to data_)

## Where to start? {#letsgo}
We're just testing the last bits of the tutorial and will publish the tutorial on the **28th of September 2020** latest. Check back again then, or get a notification when it is ready by clicking on the button below.

[Notify me when the tutorial is ready](https://forms.gle/DuNouDBeYJBhXBcDA){: .btn .btn-green target="_blank"}

<!--
## Share your creation! {#share}
Although the template in the tutorial was made as part of a research project, it is fully stand-alone, [private and secure](#more-safe), and publicly available for anyone to follow. In other words, we have no clue how you are using it! Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for.

Let us know what you created by using the [I made it!](#imadeits){: .btn .btn-yellow target="_blank"} button [on the Instructables page](#instructable){:target="_blank"}!
-->

## Join our research {#join}
Aside from being curious about what you have created, we are also looking for families who want to follow this tutorial, and whom we can interview about doing so. We would like to hear what they've created and how they've put their smart display to use! To show our thanks, we are giving each participating family a small monetary reward. Interested, or questions? Contact the researcher at _d.verweij2[@]newcastle.ac.uk_ or read more [about the research study](#more-study).

[Email David](mailto:d.verweij2@newcastle.ac.uk?subject=Phone%20Grown%20Research%20Tutorial&body=Hi%20David){: .btn .btn-purple}

<br/>
<br/>
<hr/>
<br/>

## More info {#more}

### About this research {#more-about}
As part of David's PhD, we explore how you can be creative with technology at home in a less-technical way. We think this is very important in a time where we have a lot of technology in the home, and they seem to be getting more complex by the day! We are becoming more dependent on others (service centres, family members) when it comes to these complex things. This is why we believe we should make technology more accessible, not just to make customers - like you - less dependent from manufacturers, but also to allow you and everyone in your family to maintain in control.

To understand how we can do this structurally, we started to develop and test different ideas. One idea we previously tested focused on using _creativity before skill_, which was quite successful in engaging more people in the household with technology. We now want to continue this idea and see how it works in a family setting. Due to the current 2020 pandemic, we are doing so through a tutorial, which allows us to test our concept without endangering anyone. Besides, a tutorial is much easier to share publicly than a physical prototype, reaching more people who might be interested and want to give it a try!

### The research study {#more-study}
Aside from being curious about what you have created, we are also running a research study about this tutorial. In this study, we ask families to create a smart display following this tutorial _four times_, once each week. We would then like to hear how they got along, and how they've put their smart display to use! To do so, we will have two virtual interviews of ~1.5 hours - one at the beginning and one at the end - and keep in touch through weekly (and short) video calls. We are looking for **UK-based families**  with at least one child (~4-16 years old) living at home, and would like to **start on the 10th of October 2020**. To show our thanks, we are giving each participating family a monetary reward. Interested, or questions? Please contact the researcher at _d.verweij2[@]newcastle.ac.uk_.

[Email David](mailto:d.verweij2@newcastle.ac.uk?subject=Phone%20Grown%20Research%20Tutorial&body=Hi%20David){: .btn .btn-purple}

_This research has been approved by the Newcastle Ethics Committee on 21/08/2020 (ref: 20-VER-024) and as such follows strict guidelines for collecting and managing data, and ensuring the safety and privacy of participants._

### The technology bit {#more-tech}
We designed this tutorial in such as way you don't need any coding experience, and no coding will be involved! All of that is already prepared, so you can focus on playing around with data, colours and drawings. The tutorial will explain all the steps you need. But, if you are a bit more interested in the prepared code and functionality, here is a short summery.

In the tutorial, you will be copying a Google Sheet to use as your own. Attached to this Sheet is a piece of code (a Google App Script) that you can publish as your own 'web app'. This creates a way to read and write data into that Google Sheet via the web browser, which is an approach used in some 'app making' services such [glide](https://www.glideapps.com/){:target="_blank"}. Your web app will then also create an anonymous account for our external database. This is fully anonymous and very lightweight (see [privacy and safety](#more-safe)), and is needed to make your phone respond quickly to changes in your Google Sheet - something your web app unfortunately can't offer.

When a smart 'rule' you created in the Google Sheet is activated (e.g. the data tells it that it will start to rain), it will update your anonymous account in the database. Once you visited the Phone Grown website on your phone, the phone can detect these updates. It will then visit your web app and ask for the latest instructions. By design, your web app only allows ([very specific](#more-safe)) information to be read from the Sheet.

To get your smart display listening to data, we use [IFTTT.com](https://ifttt.com/google_sheets){:target="_blank"} - which already supports Google Sheets. Then, each time new data is added to the Sheet, the code will check if any of your smart 'rules' (that you can create) should be activated. If it activates, the code will update your anonymous account in the database. In return, your phone will visit your web app to get the latest instructions. If you are interested, you can find more details on [GitHub](https://github.com/davidverweij/phone-grown){:target="_blank"}.

### Privacy and safety {#more-safe}
We designed this tutorial with three things in mind. First, we want you to be able to create a smart display in such a way that you don't have to program or fiddle with complex tools. Second, you and your family should be able to do this by yourself (DIY), to work together and have fun! And lastly, we wanted this to be standalone, being able to grow and evolve without us - what others would call 'open source'. That is why we based our tutorial on existing, common and (hopefully) familiar tools, such as Google Sheets. This way, you are in control over the tools, and in cases where some functionality is a bit hidden or complex, we made things as transparent as possible, read more [below](#more-safe-details).

Aside from one 'dependency' (our external database, see also below), you have access to everything: your copy of the Google Sheet, the functionality that is attached to that via code, the IFTTT 'triggers' you set up and even the phone and its web browser. Compared to products you buy in-store, we think this approach is quite valuable and interesting, and would love to hear your thoughts on that. Of course, whilst we did our very best to be as transparent and clear as possible, we welcome any feedback, help and [contributions](#more-contr).

#### **Disclaimer** {#disclaimer}
Whilst we put a lot of effort in writing this tutorial, it remains a 'do-it-yourself' activity for which we cannot take any liability. It is your responsibility to use this tutorial as you see fit, and in doing so, you understand that this comes without any warranty. We cannot be held liable for any claim, damage or other liability from following this tutorial or using the tools referred to. More details in our [MIT License](https://github.com/davidverweij/phone-grown/blob/master/LICENSE){:target="_blank"}, the terms of service of [Instructables.com](http://usa.autodesk.com/adsk/servlet/item?siteID=123112&id=21959721){:target="_blank"} and of [IFTTT.com](https://ifttt.com/terms){:target="_blank"}.


#### **You privacy and safety** {#more-safe-details}
Of course, even though you do not need to do any programming, it doesn't mean some code is involved. _So how did we ensure your privacy and safety?_ We designed almost all functionality into a Google Sheet - that you can freely copy. By copying it, you can access all aspects of the Sheet including the code, which prevents it from having any active connections to other services. Only when you 'publish' the code as a web app, it becomes publicly accessible. To connect to your web app, you need to know the complex link. Besides, the code is written such that when something connects with your web app, it can only retrieve the phones instructions. These instructions include a time, duration and the colours for the background, no sensitive data at all.

The only functionality that we were unable to incorporate into the Google Sheet was a real-time connection between the phone and that Sheet. This is why your copy of the Google Sheet will connect to our database hosted in West Europe. When it does, it will create an anonymous account. The database has very strict and elaborate security rules (see [here](https://github.com/davidverweij/phone-grown/tree/master/resources#firestore-rules){:target="_blank"}) so that only the anonymous 'user' can store something in this database, and this can only be one single number, no more - no less. Each time your code connects with that database it will authenticate itself with a complex name and even more complex password only your code knows. Reading from this database can however be done without authentication, but only if you know the complex name of your anonymous 'user'. Even then, it only stores a single number, again no sensitive data at all.

Of course, the smart display depends on incoming data, for which we use IFTTT.com. We did our best to ensure your privacy and safety on our part, but for the use of IFTTT we have to refer you to their [terms and conditions](https://ifttt.com/terms){:target="_blank"}. More details of what the code we wrote is and what it does can be found [here](https://github.com/davidverweij/phone-grown){:target="_blank"}.


##### Using older phones {#more-safe-phones}
Since this tutorial motivates you to use an older, unused smartphone, it is worth mentioning that most phones do not receive security updates after ~3 years<sup>*</sup> and become vulnerable for security breaches and 'hacks'. If you are not using the phone for any other purposes, we suggest to 'factory reset' your phone. Note that _this will delete all files, apps and data on the phone_. This can often be done from the phone's `Settings` menu. Whether you did a factory reset or not, it is always good practice to update the software and security updates to the latest version (as far as it goes). Here is how to do that for [Android](https://support.google.com/android/answer/7680439?hl=en-GB){:target="_blank"} or [iOS](https://support.apple.com/en-gb/HT204204){:target="_blank"}. You can read more about [the safety of using older phones here](https://www.tomsguide.com/uk/us/old-phones-unsafe,news-24846.html?region-switch=1593506477){:target="_blank"}.

_<sup>*</sup>For iOS devices this is ~5 years since its first release, for Android this is often shorter (~3 years)._

### Sustainability {#more-sust}
We admit that the tutorial asks you to keep a phone up and running indefinitely to create a smart display. This introduces some electricity consumption (roughly 2kWh per year, or €1/£1 per year)<sup>*</sup>, especially if that phone was previously just kept in storage. The tutorial also requires the phone to be constantly connected to a charger. Whilst this doesn't consume (much) extra electricity, leaving your phone on the charger at all times is not the best treatment for your battery. This should be fine if you are using an older, unused, phone, but might not be best if you are using a modern phone for this tutorial in the long run. Despite these effects, we think this tutorial to explore how smart displays can contribute in your life takes a reasonable sustainable approach - especially compared to producing and buying products from the store. If this tutorial made you think about sustainability, whether you built a smart display or not, we highly recommend you to turn in unused phones (and other products in general) for recycling so its [precious materials can be reused](https://www.recyclenow.com/recycling-knowledge/how-is-it-recycled/electricals){:target="_blank"}.

_<sup>*</sup>Fully draining and charging a Samsung Galaxy S6 (2015 - 2550 mAH 3.85V battery) each day would take up ~5.5 Wh, or 2 kWh per year. For €0,30 / £0,30 per kWh, this would cost no more than €/£1 each year._

### Contributing {#more-contr}
We are always looking for ways to improve our work and we welcome any suggestions, tools or tips about the tutorial. You can leave feedback on the [Instructables.com](#instructablescom){:target="_blank"} page, contact me at d.verweij2[@]newcastle.ac.uk or contribute to this project on [GitHub](https://github.com/davidverweij/phone-grown){:target="_blank"}.
