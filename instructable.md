---
layout: default

carousel_step1:
  - image: /assets/images/sunshine.jpg
  - image: /assets/images/sunshine.jpg
  - image: /assets/images/sunshine.jpg
  - image: /assets/images/sunshine.jpg
  - image: /assets/images/sunshine.jpg
---

![alt text](/assets/images/sunshine.jpg "text1")

# **Turn an Unused Smartphone Into a Smart Display**

Do you have an (old) unused smartphone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial.

When you finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change colour based on some data that you choose. For example, the screen could _turn blue on the left when it will rain_, and _turn yellow on the right when the temperature is high_ (see also the picture at the top). Now, when you add a little drawing in front of your phone it shows you, and anyone else at home, what the colours mean.

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

_If you are using an older smartphone, consider resetting it to factory settings (warning, this will delete everything on the phone!). Either way, it is always good practice to update the software and security features to the latest version (as far as it goes). We wrote a bit more info about the safety of older phones [here](https://www.phonegrown.site/#more-phones){: target="_blank"}._

## Step 1: copy the Google Sheet
Normally, Google Sheets is mainly used for storing numbers in large tables - but because it is online and very flexible, you can do quite interesting things with it. For this tutorial, we will use it as the  'brain' of your smart display. We have prepared a Sheet for you with everything you need - which works almost like an app. With it, you can create the colourful backgrounds for your phone and easily set up rules depending on the data you'd like (for example, 'turn blue when it rains'). We need to copy this Sheet using the link below and prepare it in two quick steps.

On a laptop/computer go, copy the [Google Sheet from here](#copy){: target="_blank"}. _This will probably ask you to log in to a Google Account._

### 'Publish' your Google Sheet
The following steps will connect the Sheet to the internet, which helps you to connect your phone in the next section. We only have to click a few buttons, but it might look somewhat messy. This is because we basically are turning your Sheet into a little app. Most likely you have never done this before, and that is why Google will show you a warning at some point. If you copied the Google Sheet from the link above - it is safe to continue. However, if you want to know precisely what your app will do, we explain it in more detail on our website [here](https://www.phonegrown.site/#more-tech). At any point in time, you can always undo the 'publishing' of your app by following [these steps](https://www.phonegrown.site/#more-undo).

{% include carousel.html images=page.carousel_step1 height="50" unit="%" duration="7" %}

Once you have the Google Sheet in front of you:
1. Press the purple _Setup_ button.
1. Go to _Tools > Script Editor_ in the Google Sheet menu bar. This opens a new tab.
1. Click on _Publish > Deploy as web app_ in the menu bar on that tab.
1. Click _Update_, and _Review Permissions_ when it asks for authorisation in the popups that follow. You might need to log in with your Google Account.
1. Click _Advanced_ (in the bottom left) and then, at the bottom, click on _Go to phonegrown_v3 (unsafe)_. By clicking on _Allow_ allow (or authorise) your google Sheet to connect to other services on the internet (including your phone in the next step).
1. _Copy the long URL_ link shown in the popup, and
1. Paste this next to the _PASTE APP LINK_ on the _Home_ screen of your Google Sheet.

That's all set! You can now close the extra tab, but keep the Google Sheet tab handy.  

## Step 2: setup the phone
Once you found an unused phone for this project (_don't worry about cracked screens_), we need to change some of its settings and connect it to your Google Sheet.

### Adjust phone settings
Normally, phones dim their screen in dark spaces or when you don't use it for a minute or so. But, to make it into a smart display we need to make sure its screen always stays on. This won't consume much energy, but we wrote more details about that [here](https://www.phonegrown.site/#more-sust){:target="_blank"}. Adjusting your phone's settings can be different per phone, but will most likely be something like this:

1. For **Android** phones, enable the _developer_ mode by tapping 7 times on the _build number_ in _Settings > About Phone_. Then in _Settings > System > Developer Options_ turn on _Stay Awake (when charging)_. For **Apple** devices, we can set the _Auto-Lock_ to _Never_, which you can find in _Settings > Display & Brightness_. Here are more details and pictures on how to do this for [Android](https://www.howto-connect.com/how-to-stay-awake-phone-screen-while-charging-on-android/){:target="_blank"} or [iOS](https://forums.tomsguide.com/faq/how-to-change-the-auto-lock-time-in-ios-11.19693/){:target="_blank"}.
1. Where possible, also disable the _Adaptive brightness_ (or Auto-Brightness) of your phone. We want to make sure the screen is visible through the paper. For **Android**, you can most likely change this in _Settings > Display_, and for **Apple** devices, this is often in _Settings > Accessibility > Display & Text Size_.
1. Don't forget to set the screen brightness to 100% and, of course, plug in a charger!

### Connect it to the Google Sheet
On the phone,
1. Go to [www.phonegrown.site/phone](http://www.phonegrown.site/phone){:target="_blank"}.
1. Enter your _Phone Grown ID_ which you can find in the top of your Google Sheet at the _Home_ tab.
1. If your phone supports it, you can click on _Toggle Fullscreen_ to go fullscreen.

That's it! Now, in Google Sheets, go to the _[BG] 1_ tab, and click on _test_ in the top left. Did your phone's screen change colour?

## Step 3: add some data
There are various ways in which we could let your phone respond to different types of data, but in this tutorial, we will be using a website called [IFTTT](http://www.ifttt.com){:target="_blank"}, or "If This, Then That". This website allows us to create connections with different types of data, which they call _Applets_. Lucky for us, they support Google Sheets! With a free account, we can make up to three of these _Applets_. If you don't have an IFTTT account yet, you can sign up at [ifttt.com/join](https://ifttt.com/join){: target="_blank"}. _Note that through IFTTT.com you might need to log in to other services (such as Google). Read more on IFTTT's privacy policy and Google's advice on third party access._

### Create a weather applet
On IFTTT.com we can create _applets_. These are little recipes that tell the IFTTT service what to do. An applet consists of a _Trigger_ that 'triggers' when something happens, and an _Action_, that 'acts' when that happens.

For this tutorial, we will create two _applets_ that will both influence the phone. One will look at your local temperature, and the other will let you know when the International Space Station (ISS) passes over you. First, let's set up the weather applet.

First this:
1. On IFTTT.com, go to [_Create > Applet_](https://ifttt.com/create/){: target="_blank"}.
1. Click on **_If This_** and search (and click) for _Weather Underground_.
1. Choose the _Current temperature rises above_ trigger and fill in the details. For example a temperature of 15 degrees Celsius at your hometown.
1. Press _Create Trigger_ to save this.

Then that:   
1. Click of **_Then That_** and  search (and click) for _Google Sheets_.
1. Choose the _Add row to spreadsheet_ action and fill in the details. These details need to be very accurate:
    1. **_Spreadsheet name_** should be identical to the name of your copy of the Google Sheet we made earlier. You can find (and, if you want, change) this name on the very top left of your Google Sheet. _If you haven't changed it yet, it will be something like 'Copy of Phone Grown'_.
    1. Remove everything in the **_Formatted row_**, and replace it with something more readable, such as _'temperature'_. Write this name down somewhere, we will need it later.
    1. Remove everything in the **_Drive folder path_**. If you have not 'moved' your Google Sheet within Google Drive, you can leave this empty. _If you did move the Google Sheet, it might be easier to move it back to 'top-level' folder 'My Drive' and follow along._
1. Press _Create Action_ to save this.
1. Click _Continue_, and then _Finish_ to finish your Applet!

It should now show you a _Connected_ Applet. Nicely done.

### Create a space applet
Now, we will set up the Space Station applet. Follow the same steps above, but for the **_If This_** look for _Space > ISS passes over a specific location_. Also follow the exact same steps for the **_Then That_**, except give the **Formatted row** a different name, for example '_ISS_'.

Great! We should now have two IFTTT applet that both tell your Google Sheet when something happens. Unfortunately, we won't be able to see any effects from this data until the temperature actually rises or when the ISS passes over. But, we can prepare for when that happens in the next steps!

## Step 4: draw a display
What we like about smart displays is that they add something visually to the home. They can tell everyone in the home when something is happening, without a loud 'beep' from someone's phone. To make sure your smart display fits your home, skills and style, we will create our own! Instead of fiddling digitally, we are going to create a drawing, physically. If you are doing this tutorial with the family, try to get everyone to add something to it! Before we draw, we first need a holder for our phone.

### Decide how to display your smart display
To make sure that your smart display can be seen from different places in the room, we need to make it stand vertically. This is entirely up to you and depends on where you want to have it. You could for example hang the phone on the wall with some hooks and wire, attach it to your fridge or perhaps place it in a phone stand. Either way, **_make sure the phone is plugged in and charging_**. If you don't have a phone stand, we found and followed a quick and easy [tutorial on folding a phone stand](https://youtu.be/mW5M6cepIBI){: target="_blank"} out of an A4 sheet of paper by Wellington Oliveira (@Easy Origami) on Youtube. It takes no more than 10 minutes and fits nicely with the paper drawing in the next step.

### Start drawing
At the end of this tutorial the phone will highlight areas of your drawing to indicate something happened, or in our case, when the temperature rises and when the ISS passes over. Think about a drawing that could represent both of these things at the same time, or perhaps create two separate drawings on the same paper. The drawing doesn't have to be literal, it can also be abstract - anything you want really! Since the background highlights will be quite colourful, we suggest sticking to a line drawing with a pen or pencil. Don't worry about getting it right the first time, you can easily try a few drawing or change the drawing later!

1. Cut a piece of white paper a bit larget than your phone. _Use thin, standard copier thickness (~70/80gsm) so that the phone's screen can shine through_.
1. Place the paper over the phone in its stand, and roughly mark the corners of the screen with some dots.
1. Take the paper off the phone, and start drawing! You can use the marked corners to know where the screen lights up later on.

Once you're happy with a drawing, place the drawing in front of the phone and go to the next step. You can always come back and change or redo the drawing if you feel like it!

## Step 5: create and connect backgrounds
All that is left to do is to highlight your drawing when the data says something is happening. Using the Google Sheet, we will now indicate which areas should light up, and in which colours, using _backgrounds_. Let's first focus on the part of your drawing that indicates the high temperature.

### Design two backgrounds
Once you have the Google Sheet in front of you:
1. Go to the _[BG] 1_ tab (on the bottom).
1. Change the background colour of the cells/squares within the 'phone frame' that roughly corresponds with the part of your drawing that has something to do with the weather.
    1. You can do this by selecting (_click and drag_) the cells/squares, and clicking on the _fill colour tool_: the little _paint bucket_ in the toolbar.
    1. The colour is totally up to you! You can even give different cells/squares different colours.
1. Click on the _Test_ button to test the colours on your phone.
1. Adjust the background and keep testing until you are satisfied.

Now, for the ISS space station:
1. Go to the _[BG] 2_ tab (on the bottom).
1. Repeat the steps above but now focus on the parts of your drawing that have something to do with the ISS space station.
    1. **On the phone, if two or more backgrounds are shown, overlapping coloured cells/squares will mix their colours. If you don't want this, leave the cells/square black if you use them in another _[BG]_ tab.**

### Connect the data to the backgrounds
With your backgrounds ready to go, we need to tell the Google Sheet which one to show on your phone when something happens, the rise in temperature of the ISS passing over. On your Google Sheet:

1. Go to the _HOME_ tab (on the bottom)
1. Fill in the dotted cells/squares for rule 1.
    1. _In the first dotted cell_, enter the name that you entered for the _Formatted row_ for your weather 'applet' in Step 3, for example, 'temperature'. **This needs to be exactly the same.**
    1. _In the second_, choose the background you created for the weather, most likely _[BG] 1_.
    1. _In the third and fourth_, enter how long you want this background to show on your phone when the applet 'triggers'. _For example, if 'temperature' then show '[BG] 1' for '20' 'minutes'_.
    1. _Activate_ the rule by ticking the second tick-box on the right.
    1. _Test it!_ Click on the tick-box on the right to test your rule.
1. Repeat the steps for rule 2, but now for the ISS data. _Remember that the text in the first dotted cell should be identical to the **formatted row** as you used when creating the applet with IFTTT_

If you test both rules, you should be able to see both backgrounds light up your drawing!

## Enjoy and experiment!
Your smart display is now ready to go! Place it in a location where you and your household can see and notice when different backgrounds are triggered. Of course, you can experiment a bit more with different types of data using IFTTT, different drawing and different background. Just follow the steps above for any of these if you'd like.

### Extra features
There are a few additional options and features you could explore:
- You can create **more backgrounds** (up to 10) by clicking the blue _New Background_ button on the _Home_ tab. You can reset a background by clicking on the green _Clear_ button on the background tab itself.
- You can **set times for the phone to 'turn off'** by changing the _from_ and _to_ times in the 3rd, green, bar on the _Home_ tab. During these times, the phone will not respond to data and only show a black screen. _This might be useful for during the night when you don't want your smart display to light up_.
- If you are curious about when something happened, the _**[DATA] History**_ tab shows you all past times when one of your IFTTT applets 'triggered'. The _**[LOGS]**_ tab shows you when a rule you created in Step 5 was activated and it shows other interactions with the Google Sheet.

### Data suggestions
There are a lot of things you could use your smart display for, and because of that, you might not see the wood for the trees. With IFTTT, some _applets_ are designed to work with specific devices and brands. We have listed several things that we think might be a bit more relatable and more common to use. Have a look at these, but foremost, explore, try out and be creative!

_For example_, you could let your smart display show ...
- when the [weather changes](https://ifttt.com/weather),
- when you leave or enter an area based on your [GPS location](https://ifttt.com/location),
- when it is a certain [time of the day, week or month](https://ifttt.com/date_and_time),
- if there is a new song on [Spotify](https://ifttt.com/spotify) or [Deezer](https://ifttt.com/deezer),
- if there is a new video to watch on [Vimeo](https://ifttt.com/vimeo), [Youtube](https://ifttt.com/youtube) or [Twitch](https://ifttt.com/twitch),
- when you have a new email with [Office365](https://ifttt.com/office_365_mail),
- a reminder that you have 15 minutes left before an event on your [Google](https://ifttt.com/google_calendar), [Office365](https://ifttt.com/office_365_calendar), or [iOS](https://ifttt.com/ios_calendar) calendar,
- when someone spends money on their [Monzo bank](https://ifttt.com/monzo) account,
- when a blog or news website publishes a new article using their [RSS feed](https://ifttt.com/feed),
- tracking sports goals using [Strava](https://ifttt.com/strava) or [FitBit](https://ifttt.com/fitbit)
- social media activity on [Facebook](https://ifttt.com/facebook), [Twitter](https://ifttt.com/twitter), or [Instagram](https://ifttt.com/instagram),
- messages on [Telegram](https://ifttt.com/telegram) or [Android](https://ifttt.com/android_messages) phones.

If you have a smart device, you could connect your smart display to your ...
- [Amazon Alexa](https://ifttt.com/amazon_alexa) or [Google Assistant](https://ifttt.com/google_assistant) smart speaker,
- [Wemo](https://ifttt.com/search/query/wemo?tab=services) smart plugs or equipment,
- and many other things!


### Deleting your smart display
When you are finished with your smart display, you can easily undo the web app, Google Sheet and phone connections.
1. In the Google Sheet, go to _Tools > Script Editor_. On this new tab’s menu bar, go to _Publish > Deploy as web app_ and choose _Disable web app_ in the top right of the popup.
1. On your phone, go to https://www.phonegrown.site/phone. If it is connected to your Google Sheet, press _Reset Connection_.
1. For any data (or ‘applets’) you made wit IFTTT, go to IFTTT.com and ‘_disconnect_’ these applets.

You have now removed any connections we have set up in this tutorial.

### More info
If you are curious about the background behind this project, how your privacy is ensured or how the smart display works, visit [www.phonegrown.site](https://www.phonegrown.site/#more){: target="_blank"}.
