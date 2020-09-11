---
layout: default

headerimage:
  alt: A drawing showing half rainy and half sunny weather. The halves are highlighted depending on the weather, using a phone placed behind the drawing
  url: "/assets/images/sunshine.jpg"
---

## About
Do you have an (old) unused smart phone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial. Show what you can make and support our research!

_This tutorial is developed by David Verweij at Newcastle University as part of his PhD research, read more [here](#about-this-research)._

## What can it do?


## Tools & Materials you need
- a smartphone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- some pen and paper
- a computer/laptop to set things up
- a Google account (_for using Google Sheets_)
- an IFTTT.com account (_for connecting it to data_)

## Where to start?
We're just testing the last bits of the tutorial and will publish the tutorial on the **28th of September 2020** latest. Check back again then, or get a notification when it is ready by clicking on the button below.

The tutorial is fully stand-alone and publicly available for anyone to follow, and we are very curious what you make with it! Since your choice of data and creativity with drawing allows countless possibilities, we just can't imagine what you will use your smart display for. Share your creation by using the <span class="fs-3">[I made it](#imadeits){: .btn .btn-yellow }</span> button on the Instructabled page!



as part of a research project

Although this tutorial has been created as part of a research project, it will be published to Instructables.com freely available for anyone to use. In this case, we will capture none of your data
 as part of our research, but in such a way
<!--
- no strings attached, but looking for what you make with them. Give it a try and let us know what you made with it ('click on the I Made This button in Instructables.com')
- aside from curious what you make, we are also looking for 10 UK-based families to follow this tutorial and use their self-made smart display over four weeks. Small monetary incentive, read more.

-->
<details markdown="block">
  <summary>
    &#9658; More info
  </summary>
  {: .text-delta }
  lorem ipsum
</details>


<button type ='button' name='button' class="btn btn-green" href="https://forms.gle/DuNouDBeYJBhXBcDA" target="_blank">Notify me when the tutorial is ready!</button>



## FAQ

### About this research
For his PhD, David explores how you can be creative with technology at home in a less-technical way.

<!--
The first is that in my PhD work, I am looking to increase the engagement that different family members have with technology to increase their agency and control over technology in general. Especially with IoT devices, their complexity and strict integration with services and other devices can be very daunting to even start to understand it. It currently require a certain 'digital mindset'.

At the same time, and our second motivation for this workshop, is that we see more ways to tinker and explore IoT at home - though this is heavily limited by usage of proprietary hardware and software. The Little Printer as mentioned in the workshop paper is a good example of this.

We think both of these are feeding into the planned obsolescence and is limiting the integration of tech into the fabric of the homes.

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
