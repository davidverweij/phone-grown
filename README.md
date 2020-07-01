
![Project Type: Tutorial](https://img.shields.io/badge/repo_type-tutorial-brightgreen)
[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![HitCount](http://hits.dwyl.com/davidverweij/phone-grown.svg?)](http://hits.dwyl.com/davidverweij/phone-grown)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# *Phone-Grown* : How to transform an old smartphone into a 'smart' drawing

Phone-Grown is a project that aims to repurpose 'obsolete' phones into personal artefacts of the future home. It is built on Google Sheets, which allows full control and transparency. Follow along to explore what home-grown artefacts you can create around an old phone, or contribute to the project here on GitHub.

```shell
NOTE: THIS REPO, AS WELL AS THE README, IS IN PROGRESS - NO STABLE RELEASE AVAILABLE YET
```

## Ingredients
You will need:
- An 'obsolete' phone or tablet (that can connect to the Wi-Fi)
- A computer/laptop to set things up
- A Google Account for Google Sheets
- Some creativity and basic materials (e.g. paper, pencils)

## How To
- We are going to make
- and to so
picture,
etcetc

```shell
DISCLAIMER!
 - Own risk, keeping a charger plugged in. Becomes / stays hot? Stop this. Secutiry as well. Stay safe. Etc. COmmon sense.
```


### Step 1: Prepare the 'obsolete' phone
You can follow along with a phone of any age, as long as it can connect to the Wi-Fi, can be charged and has a screen (but it can be cracked!). In any case, since we are connecting it to the Internet, we need to do ensure some level of security.

#### Update to the latest security settings

Most phones do not receive security updates after ~3 years<sup>[1](#secutiry)</sup> and become vulnerable for security breaches and 'hacks'. If you are not using the phone for any other purposes, we suggest to 'factory reset' your phone. **This will delete all files, apps and data on the phone**, and can often be done from the phone's `Settings` menu. Whether you did a factory reset or not, it is always good practice to update the software and security updates to the latest version (as far as it goes). Here is how to do that for [Android](https://support.google.com/android/answer/7680439?hl=en-GB) or [iOS](https://support.apple.com/en-gb/HT204204).


#### Keep the screen awake

As we want the phone to visibly respond to incoming data, we need to keep the screen awake. On Android phones, we need to enable `developer` options by tapping 7 times on the `build number` in *Settings > About Phone*. Then in `Developer Options` turn on **Stay Awake when charging**. For iOS devices, we can set the **Auto-Lock** to `Never`, which you can find in *Settings > Display & Brightness*. See more info how to do this for [Android](https://www.howto-connect.com/how-to-stay-awake-phone-screen-while-charging-on-android/) or [iOS](https://forums.tomsguide.com/faq/how-to-change-the-auto-lock-time-in-ios-11.19693/).

All that is left is to keep the charger plugged in at all times. Where possible, disable the `Adaptive brightness` (often in Settings > Display) and set the brightness to 100%. This will help in the visibility of the screen when we put some paper in front of it. Of course, keeping your phone plugged in and screen on full brightness consumes energy - though no more than 2kWh (or €1/£1) per year. Click the arrow below to read more.

**<details><summary>More on the power consumption</summary>**
<i>
> Keeping your screen on all the time will increase the power usage of your phone. In addition to that, the processor is not going to sleep. This is different from the modern screensavers on phones, as they use processing power and energy intelligently. Unfortunately, since we use older phones and a website instead of an app, we cannot use this approach. Instead, this tutorial requires you to keep the phone on a charger, similar to how you would Chargers that are not charging use [almost no energy](https://www.howtogeek.com/231886/tested-should-you-unplug-chargers-when-youre-not-using-them/). However, leaving your phone on the charger at all times is [not the best treatment](https://www.digitaltrends.com/mobile/expert-advice-on-how-to-avoid-destroying-your-phones-battery/) for the longevity of your battery. This should be fine when using an older, obsolete, phone, but might not be best if you are using a modern phone for this tutorial in the long run.
>
> **A rough calculation (2kWh, < €1/£1 per year)**\
Let's take a 'new' Samsung Galaxy S6 (2015) with a battery of 2550 mAH (3.85V). If the phone would be fully drained (and charged) each day, it would take up to 5.5 Wh, or 2 kWh per year. With a current average energy cost of [less than €0,30 / £0,30](https://ec.europa.eu/eurostat/statistics-explained/index.php/Electricity_price_statistics) per kWh, it would cost no more than one euro or pound each year.

</i></details>


## Step 2: Copy the Google Sheet and set it up  
Rather than using specially-built apps, we will set up a connection with data sources and determine how the phone's screen responds all through a Google Sheet. This should give you full control and visibility of what is going on 'behind the scenes', and we think the spreadsheet layout should feel feel somewhat familiar. Even more so, because you will create a copy of the template below, no-one else but you will have access to the data and functionality you are about to set up.

&#9658; [Copy the Google Sheet from here]().

In your copy of the Google Sheet, a few additional steps are outlined. Follow these and your phone will soon visibly respond to input from 'outside'!


## Step 3: Connect your 'old' phone
>This step is also mentioned within your copy of the Google Sheet

On your old phone, visit [phonegrown.site/phone](www.phonegrown.site/phone). This website (which is hosted on the open source platform GitHub) presents you with a input field. Enter the 'ID' as shown in the Google Sheet and press connect. You should see a confirmation on the phone as well as in the Google Sheet.

Test your setup by clicking the tick box `☐` in the *Test Rule* in the Google Sheet. Change the *Area of the Phone* and *Color* and see how your phone changes along.

## Step 4: Connect to data sources (using IFTTT.com)
There are various ways in which we could let your phone 'listen' to various data sources. In this tutorial, will be using *If This, Then That ( [ifttt.com](www.ifttt.com) )*. If This Than That is a [service that connects numerous services and devices](https://help.ifttt.com/hc/en-us/articles/115010325748), allowing you to create certain interactive rules. For example, *if* you come home, *then* it can automatically turn on the lights. Most rules are bound to specific products from specific brands (e.g. Gmail, Phillips), though there are a handful of *'generic'* sources, such as the weather or RSS feeds. Following the example below will set up your phone's screen to respond when there is a new article on bbc.co.uk (or most other news or blog sites you might like). It is a good starter to get to know the Google Sheet template, and enable you to comfortably explore different data sources on your own.

> **Note**: If you follow this approach, you will need (to create) an IFTTT.com account. Some services require you to log in (often with your Google Account), and require access to some of your information. Read more on [IFTTT's privacy policy](https://ifttt.com/terms) and [Google's advice on third party access](https://support.google.com/accounts/answer/3466521).  

### Change the colour of the phone if the BBC publishes a new article
IFTTT works by selecting a 'trigger', the *if this*, and indicating what it should do when the trigger occurs, the *then that*. In this example we want to know when a new article is published on bbc.co.uk, and - **as with all triggers for IFTTT** we want to feed this information into our Google Sheet. T


http://feeds.bbci.co.uk/news/world/europe/rss.xml

##### Other examples using IFTTT.com
<details>
<summary>Blink 5 times each hour</summary>

> Something about Date & Time trigger, additional rule

</details>

<details>
<summary>Turn blue when it is going to rain, yellow if it clears up</summary>

> Something about Date & Time trigger, additional rule

</details>


### Using...  If This Then That (IFTTT.com)
Lorem Ipsum




# How does it work?

- link to GAS README
- link to Firebase README
- explainer,
- etc..

# Contribute

# License


# Future vision
- smart use of energy (not screen always on), detecting movement (when is it relevant?), etc.
- explore reuse of other types of devices in a safe way

<a name="secutiry"><sup>[1]</sup></a> For iOS devices this is roughly after 5 year since its release, for Android this is often shorter (~3 years). You can read more about [the safety of using older phones here](https://www.tomsguide.com/uk/us/old-phones-unsafe,news-24846.html?region-switch=1593506477).
