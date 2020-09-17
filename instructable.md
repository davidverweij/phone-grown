---
layout: default
---

# **Turn an Unused Smartphone Into a Smart Display**


![alt text](assets/images/sunshine.jpg "text1")

Do you have an (old) unused smartphone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial.

When you finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change colour based on some data that you choose. For example, the screen could turn _turn blue on the left when it will rain_, and _turn yellow on the right when the temperature is high_ (see also the picture at the top). Now, when you add a little drawing in front of your phone it shows you, and anyone else at home, what the colours mean.

Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for!

[Check the video](#video){: .btn .btn-blue target="_blank"}

<!-- TODO: get some help, go creative with drawing! ?? Perhaps seperate taasks?-->

## Supplies
<!-- TODO: something about parents for account, do it together! -->
- A smartphone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- Some pen and paper
- A computer/laptop to set things up
- A [Google account](https://myaccount.google.com/){:target="_blank"} (_for using Google Sheets_)
- An [IFTTT.com](https://www.ifttt.com/){:target="_blank"} account (_for connecting it to data_)

_If you are using an older smartphone, consider resetting it to factory settings (which will delete everything on the phone). Either way, it is always good practice to update the software and security updates to the latest version (as far as it goes). We wrote a bit more info about the safety of older phones [here](https://www.phonegrown.site/#more-safe-phones){: target="_blank"}._

## Step 1: the Google Sheet

- can set times to make the screen turn black (for example at night) (but we leave the phone on at all times)

## Step 2: the Phone
Once you found an unused phone for this project (_don't worry about cracked screens!_), we need to change some of its settings and connect it to your Google Sheet.

### Adjust phone settings
Normally, phones dim their screen in dark spaces or when you don't use it for a minute or so. But, to make it into a smart display we need to make sure its screen always stays on. This won't consume much energy, but we wrote more details about that [here](https://www.phonegrown.site/#more-sust){:target="_blank"}. Adjusting your phone's settings can be different per phone, but will most likely be something like this:

For **Android** phones, enable the `developer` mode by tapping 7 times on the `build number` in _Settings > About Phone_. Then in _Settings > System > Developer Options_ turn on `Stay Awake (when charging)`. For **Apple** devices, we can set the `Auto-Lock` to `Never`, which you can find in _Settings > Display & Brightness_. Here are more details and pictures on how to do this for [Android](https://www.howto-connect.com/how-to-stay-awake-phone-screen-while-charging-on-android/){:target="_blank"} or [iOS](https://forums.tomsguide.com/faq/how-to-change-the-auto-lock-time-in-ios-11.19693/){:target="_blank"}.

Where possible, also disable the `Adaptive brightness (or Auto-Brightness)` of your phone. We want to make sure the screen is visible through the paper. For **Android**, you can most likely change this in _Settings > Display_, and for **Apple** devices this is often in _Settings > Accessibility > Display & Text Size_.

Don't forget to set the screen brightness to 100% and, of course, plug in a charger!

### Connect it to the Google Sheet
On the phone, go to [www.phonegrown.site/phone](http://www.phonegrown.site/phone){:target="_blank"}. Enter your _Phone Grown ID_ which you can find in the top of your Google Sheet at the 'Home' tab. That's it! Now, in Google Sheets, go to the '[BG] 1' tab, and click on _test_ in the top left. Did your phone's screen change colour?

## Step 3: the Data

## Step 4: the Drawing

#3 Step 5: All good! Now experiment


### Step 1: Prepare the 'obsolete' phone




## Step 2: Copy the Google Sheet and set it up  
Rather than using specially-built apps, we will set up a connection with data sources and determine how the phone's screen responds all through a Google Sheet. This should give you full control and visibility of what is going on 'behind the scenes', and we think the spreadsheet layout should feel feel somewhat familiar. Even more so, because you will create a copy of the template below, no-one else but you will have access to the data and functionality you are about to set up.

&#9658; [Copy the Google Sheet from here]().

In your copy of the Google Sheet, a few additional steps are outlined. Follow these and your phone will soon visibly respond to input from 'outside'!



// ## Step 4: Connect to data sources (using IFTTT.com)
There are various ways in which we could let your phone 'listen' to various data sources. In this tutorial, we will be using *If This, Then That ( [ifttt.com](http://www.ifttt.com) )*. If This Than That is a [service that connects numerous services and devices](https://help.ifttt.com/hc/en-us/articles/115010325748), allowing you to create certain interactive rules, called `Applets`. For example, *if* you come home, *then* it can automatically turn on the lights. Most rules are bound to specific products from specific brands (e.g. Gmail, Phillips), though there are a handful of *'generic'* sources, such as the weather or RSS feeds. Setting up any IFTTT 'applet' consists of two steps. Step 1 is setting up a 'trigger' of your choice. In our case, **Step 2 will be the same for any trigger you choose** - as we will be using IFTTT's provided Google Sheet integration to connect to our Google Sheet.

> If you follow this approach, you will need (to create) an IFTTT.com account. Some services require you to log in (often with your Google Account), and require access to some of your information. Read more on [IFTTT's privacy policy](https://ifttt.com/terms) and [Google's advice on third party access](https://support.google.com/accounts/answer/3466521).  

Following the example below will **set up your phone's screen to respond when there is a new article on the BBC** (or almost any other news or blog sites). It is a good starter to get to know the Google Sheet template, and enables you to comfortably explore different data sources on your own.

#### Part A: setting up the IFTTT 'Applet'

&#9658; [See a GIF/Video instruction here](resources/Images/Screen-Recording-IFTTT.gif).

1. Go to [ifttt.com/create](http://ifttt.com/create) and log in (create an account if needed).

1. Click on `[+] This`, find and choose `RSS`. Choose `New Feed Item`.

1. Enter a RSS compatible link of a website of your interest. In this example, we use `http://feeds.bbci.co.uk/news/world/europe/rss.xml` which 'triggers' for each new BBC article about Europe.

1. Click on `[+] That`, find and choose `Google Sheets`. Choose `Add row to spreadsheet`.

1. Adjust the **all three fields** to match the Phone Grown Google Sheet you copied **exactly**:

  - The `Spreadsheet name` should be exactly as the name of your copy, which you can find in the top left of the Google Sheet. If you haven't changed the name, it will be something like *Copy of Phone Grown ..*

 - We need to add a recognisable name in the `Formatted Row`, in order for the Phone Grown spreadsheet to recognise the data coming in. For example, add something like `RSS Feed`, followed by 3 vertical lines `|||` at the beginning of the `Formatted Row`, i.e. `RSS Feed ||| `.

 - The `Drive Folder Path` should be the entire path where you stored you copy of the Phone Grown spreadsheet. If you didn't 'move' the spreadsheet after you copied, it is most likely in the 'main' folder. If so, leave this field *empty*.

1. Copy all the text in the `Formatted Row`, and paste it somewhere safe. We will need this later.

1. Click `Create Action` and you are all set! You can change the name of this *Applet* if you want.

#### Part B: setting up the response of the phone
As with any data source, often the only way to see a result is to wait for it to do something - depending on the source this can take anywhere between seconds or days. Instead, we will do one more step that allows us to test your newly created IFTTT applet without waiting!

1. Open up your copy of the Phone Grown Google Sheet again. In the menu at the top, click '♻️📱 Phone Grown > 📈 New Data Source'. In the popup, paste your copy of the `Formatted Row` (from step 6 above). Click `Ok`.
> Although this step is technically not required, it sets the 'header' row for the incoming data. This makes it more clear what data is in each column, and allows us to test it as well.
