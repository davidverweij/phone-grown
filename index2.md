---
layout: default

headerimage:
  alt: A drawing showing half rainy and half sunny weather. The halves are highlighted depending on the weather, using a phone placed behind the drawing
  url: "/assets/images/sunshine.jpg"
---

## About
Do you have an (old) unused smart phone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial. Show what you can make and support our research!

_This tutorial is developed by [David Verweij](https://openlab.ncl.ac.uk/people/david-verweij/) at Newcastle University as part of his PhD research, read more [here](#about-this-research)._

## What can it do?
When you finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change based on some data that you choose. For example, the screen could turn _blue when you receive an email_ or _green when Wired.com publishes a new article_. Of course, just showing colours doesn't tell you what it means - that's where some pen and paper come handy. With a little drawing placed in front of the phone you give meaning to the colours. Since we have 'split' the screen into multiple areas, you can even show multiple things at the same time. For example, you could let the _left side turn blue when it will rain_, **and** the _right side turn yellow when the temperature is high_ (see also the image at the top). Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for!

[Check the video](#video){: .btn .btn-blue }

## Tools & Materials you need
- A smart phone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- Some pen and paper
- A computer/laptop to set things up
- A [Google account](https://myaccount.google.com/) (_for using Google Sheets_)
- An [IFTTT.com](https://www.ifttt.com/) account (_for connecting it to data_)

## Where to start?
We're just testing the last bits of the tutorial and will publish the tutorial on the **28th of September 2020** latest. Check back again then, or get a notification when it is ready by clicking on the button below.

[Notify me when the tutorial is ready](https://forms.gle/DuNouDBeYJBhXBcDA){: .btn .btn-green }

## Share your creation!
Although the template in the tutorial was made as part of a research project, it is fully stand-alone, [private and secure](#privacy-and-safety), and publicly available for anyone to follow. In other words, we have no clue how people use it! Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for.

Let us know what you created by using the [I made it!](#imadeits){: .btn .btn-yellow } button [on the Instructables page](#instructable)!

## Join our research
Aside from being curious what you have created, we are also running a research study about this tutorial. In this study, we ask families to - with the whole family - create a smart display following this tutorial _four times_, over a period of _four weeks_. We would then like to hear how they got along, and how they've put their smart display to use! To show our thanks, we are giving each participating family a small monetary reward. Interested, or questions? Contact the researcher at _d.verweij2[@]newcastle.ac.uk_ or read more [about this research](#research-study).

<a type ='button' name='button' class="btn btn-purple" href="mailto:d.verweij2@newcastle.ac.uk?subject=Phone%20Grown%20Research%20Tutorial&body=Hi%20David," target="_blank">Email David</a>

<br/>
<br/>
<hr/>
<br/>

## FAQ

### About this research
As part of David's PhD, we explore how you can be creative with technology at home in a less-technical way. We thinks this is very important in a time where we have a lot of technology in the home, and they seem to be getting more complex by the day! We used to be able to manage our own products quite well, but we are becoming more dependent on others when it comes to these complex things. Let's say you have a smart doorbell and it stops working, what do you do? If you are like us, you'll probably turn it off an on again - but after that, it will probably involve contacting the manufacturer or perhaps asking help from a family member or friend. Of course, some people have a little bit more interest in and experience with technology, but that shouldn't prevent others in the household to be in control of the products they own and use. We see this 'divide' in being able in using technology not just happen with smart doorbells, it already happens with Wi-Fi routers and smart energy meters and alike. This is why we believe we should make technology more accessible, not just to make customers - like you - less dependent from manufacturers, but also to keep you and everyone in your family in control.

In order to understand how we can make technology more accessible at home, we started to develop and test different ideas. One idea we previously tested focused on using _creativity before skill_, which was quite successful in engaging more people in the household with technology. We now want to continue this idea and see how it works in a family setting. Due the current 2020 pandemic, we are doing so through a tutorial, which allows us to test our concept without endangering anyone. Besides, a tutorial is much easier to share publicly than a physical prototype, reaching more people who might be interested and want to give it a try! That is why we put extra effort in the design of the tutorial and the tools needed, to make it private and secure, yet easily scalable for a large group of people.

#### Research study
Aside from being curious what you have created, we are also running a research study about this tutorial. In this study, we ask families to - with the whole family - create a smart display following this tutorial _four times_, over a period of _four weeks_. We would then like to hear how they got along, and how they've put their smart display to use! To show our thanks, we are giving each participating family a small monetary reward. Interested, or questions? Contact the researcher at _d.verweij2[@]newcastle.ac.uk_ or read more [about this research](#research-study).
// monetary reward?

<!--


What we see here on the slide is our exploration to motivate and enable families to tinker with IoT that hopefully mitigates these two concerns we have. At this moment, we are conducting a user study where families follow a tutorial, or instructable, that guides them through setting up a older phone they have laying around as an ambient information display. The purpose is that it should be simple and familiar, so it only requires them to visit a webpage on their old phone, and use a Google Sheet spreadsheet as a kind of user interface for changing settings. It might not be apparent on this picture, but the phone is basically directly showing a spreadsheet, with half of the cells being coloured blue, and the other half yellow. But, it also needs some craft-based investment to make the data representation meaningful. As you can see in the picture, we need some kind of drawing overlay to make the output meaningful.

# The point
The underlying concept here is that we build on existing platforms and familiar interactivity,  or what we called in the paper 'unplatformed repurposing'. Not only should this lower the barrier to get involved or interested, it should allow people of different skill levels to become more invested. For example, in this case someone could dive into spreadsheet formulas and chain various services together. Or, you could play around with colouring the background, or perhaps spend more time of different drawings. In our case we could apply this 'unplatformed repurposing' as the phone is build around standardised protocols. Of course, it depends on a third party - or Google Sheets in this case, , but since it has as screen and web-browser we could easily swap 'providers' as a matter of speaking. We think this unplatformed approach is transferable to more devices, but equally can be improved. Perhaps a more community driven, decentralised approach is more suitable. In this workshop, we'd love to discuss how we can move towards more decentralise control and agency - though at the same time, prevent the need for a digital mindset or skills. Thanks you.

-->
### The technology bit
A Google Sheet template with a document-bound script contains a few predefined formulas and methods. Once deployed, your copy of the Sheet (and script) gives you a personal API. A phone can then connect to that Sheet through that API. Using existing web services (e.g. IFTTT.com), numerous data sources can be hooked up to the Sheet. Based on your rules set in the UI, a flag will be set on a secure external database. The phone, which is listening to this flag, will request new instructions and output the visual design on screen - providing a push notification-like service.

### Privacy and safety

<!--
Most phones do not receive security updates after ~3 years<sup>[1](#security)</sup> and become vulnerable for security breaches and 'hacks'. If you are not using the phone for any other purposes, we suggest to 'factory reset' your phone. **This will delete all files, apps and data on the phone**, and can often be done from the phone's `Settings` menu. Whether you did a factory reset or not, it is always good practice to update the software and security updates to the latest version (as far as it goes). Here is how to do that for [Android](https://support.google.com/android/answer/7680439?hl=en-GB) or [iOS](https://support.apple.com/en-gb/HT204204).
<a name="security"><sup>[1]</sup></a> For iOS devices this is roughly after 5 year since its release, for Android this is often shorter (~3 years). You can read more about [the safety of using older phones here](https://www.tomsguide.com/uk/us/old-phones-unsafe,news-24846.html?region-switch=1593506477).
-->

### Sustainability
Keeping your screen on all the time will undoubtedly increase the power usage of your phone. In addition to that, the processor is not going to sleep. This is different from the modern screensavers on phones, as they use processing power and energy intelligently. Unfortunately, since we use older phones and a website instead of an app, we cannot use this approach. Instead, this tutorial requires you to keep the phone on a charger, similar to how you would Chargers that are not charging use almost no energy. However, leaving your phone on the charger at all times is not the best treatment for the longevity of your battery. This should be fine when using an older, obsolete, phone, but might not be best if you are using a modern phone for this tutorial in the long run.

A rough calculation (2kWh, < €1/£1 per year)
Let's take a 'new' Samsung Galaxy S6 (2015) with a battery of 2550 mAH (3.85V). If the phone would be fully drained (and charged) each day, it would take up to 5.5 Wh, or 2 kWh per year. With a current average energy cost of less than €0,30 / £0,30 per kWh, it would cost no more than one euro or pound each year.

### Contributing
We are always looking for ways to improve our work! We welcome any suggestions, tools or tips about the tutorial.
