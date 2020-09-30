---
layout: default
---

![alt text](/assets/images/sunshine.jpg "text1")

# **Turn an Unused Smartphone Into a Smart Display**

Do you have an (old) unused smartphone? Turn it into a smart display using Google Sheets and some pen and paper, by following this easy step-by-step tutorial.

When you have finished the tutorial, you will have turned your phone into 'smart display'. The screen of your phone will then change colour depending on what you want the display to represent. For example, the screen could _turn blue on the left when it will rain_, and _turn yellow on the right when the temperature is high_ (see also the picture at the top). Now, when you add a little drawing in front of your phone it shows you, and anyone else at home, what the colours mean.

Since your choice of data and your creativity with drawing allows for countless possibilities, we just can't imagine what you will use your smart display for!

<!-- [Check the video](#video){: .btn .btn-blue target="_blank"}-->

## Supplies
- Roughly 1 hour of time (_a bit longer if you want to experiment some more_)
- A smartphone that can connect to your Wi-Fi (_preferably one you don't need for a while_)
- Some pen and paper
- A computer/laptop to set things up
- A [Google account](https://myaccount.google.com/){:target="_blank"} (_for using Google Sheets - you need to be ~16 years or older_)
- An [IFTTT.com](https://www.ifttt.com/){:target="_blank"} account (_for connecting it to data - you need to be 18 years or older_)

If you can, follow this tutorial with someone else - perhaps with the whole family. After all, if you place your smart display in, for example, the living room, everyone will be able to enjoy it! You can follow all steps together, or divide some tasks (such as drawing or setting it up). **The images should give you a rough idea of each step, but don't contain all details. Make sure to read the textual steps as well!**

#### Younger than 18 years?
Please be aware that for the use of IFTTT.com you need to be [**at least 18 years old**](https://ifttt.com/terms#privacy-policy){: target="_blank"}. If you are younger, ask your parent or guardian to do these steps together on their account. The age limit for Google services, [varies per country](https://support.google.com/accounts/answer/1350409?hl=en){: target="_blank"}, but is generally 16. We suggest that, if you are 18 years or younger, to follow this tutorial together with a parent or guardian.

#### Reset your phone if you can
_If you are using an older smartphone, consider resetting it to factory settings (warning, this will delete everything on the phone!). Either way, it is always good practice to update the software and security features to the latest version (as far as it goes). We wrote a bit more info about the safety of older phones [here](https://www.phonegrown.site/#more-phones){: target="_blank"}._

## Step 1: copy the Google Sheet
> _For this step, you only need a laptop/computer (unfortunately, a phone or tablet won't work)._

{% include image-gallery.html folder="/assets/images/instructable/step1" %}

Normally, Google Sheets is mainly used for storing numbers in large tables - but because it is online and very flexible, you can do quite interesting things with it. For this tutorial, we will use it as the  'brain' of your smart display. We have prepared a Sheet for you with everything you need - which works almost like an app. With it, you can create the colourful backgrounds for your phone and easily set up rules depending on the data you'd like (for example, 'turn blue when it rains'). We need to copy this Sheet using the link below and prepare it in a few quick steps.

1. On a laptop/computer (_unfortunately this doesn't work on a phone_) go, copy the [Google Sheet from here](https://docs.google.com/spreadsheets/d/1JKxSbqSCLNi_dW54rmzxBtJTrP6vYvUyQmVWFcfiG0o/copy){: target="_blank"}. _This will probably ask you to log in to a Google Account._

### 'Publish' your Google Sheet
The following steps will connect the Sheet to the internet, which helps you to connect your phone in the next section. We only have to click a few buttons, but it might look somewhat messy. This is because we are basically turning your Sheet into a little app. Most likely you have never done this before, and that is why Google will show you a warning at some point. If you copied the Google Sheet from the link above - it is safe to continue. However, if you want to know precisely what your app will do, we explain it in more detail on our website [here](https://www.phonegrown.site/#more-tech){:target="_blank"}. At any point in time, you can always undo the 'publishing' of your app by following [these steps](https://www.phonegrown.site/#more-undo){:target="_blank"}.


Once you have the Google Sheet in front of you:

2. Move the Sheet into a folder on your Google Drive, by going to _File > Move_. Enter a name for the folder, such as 'phonegrown', click the tick box and _Move Here_. _The Sheet needs to be within a folder to work appropriately with the IFTTT website._ **Write this name down somewhere, we will need it later.**
3. Press the red _About / Help_ button. This will ask you to _Authorise_ the script. You might need to log in with your Google Account.
4. Click _Advanced_ (in the bottom left) and then, at the bottom, click on _Go to phonegrown (unsafe). It considers it 'unsafe' since it doesn't know you - as a developer - and Google has not reviewed this script_.
5. By clicking on _Allow_, you allow (or authorise) your Google Sheet to connect to other services on the internet (including your phone in the next step).
6. Click the purple _Setup_ button. You should see a popup saying 'Setup step 1 complete!'.
7. Go to _Tools > Script Editor_ in the Google Sheet menu bar. This opens a new tab.
8. Click on _Publish > Deploy as web app_ in the menu bar on that tab.
9. Click _Update_, and
10. _Copy the long URL_ link shown in the popup, and
11. Paste this next to the _PASTE APP LINK_ on the _Home_ screen of your Google Sheet.

That's all set! You can now close the extra tab, but keep the Google Sheet tab handy.  

## Step 2: setup the phone
> For this step, you only need a mobile phone that is connected to your Wi-Fi and its charger.

{% include image-gallery.html folder="/assets/images/instructable/step2" %}

Once you found an unused phone for this project (_don't worry about cracked screens_), we need to change some of its settings and connect it to your Google Sheet.

### Adjust phone settings
Normally, phones dim their screen in dark spaces or when you don't use it for a minute or so. But, to make it into a smart display we need to make sure its screen always stays on. This won't consume much energy, but we wrote more details about that [here](https://www.phonegrown.site/#more-sust){:target="_blank"}. Adjusting your phone's settings can be different per phone, but will most likely be something like this:

1. For **Android** phones, enable the _developer_ mode by tapping 7 times on the _build number_ in _Settings > About Phone_. Then in _Settings > System > Developer Options_ turn on _Stay Awake (when charging)_. For **Apple** devices, we can set the _Auto-Lock_ to _Never_, which you can find in _Settings > Display & Brightness_ for newer models, or _Settings > General > Auto Lock_ for older ones. Here are more details and pictures on how to do this for [Android](https://www.howto-connect.com/how-to-stay-awake-phone-screen-while-charging-on-android/){:target="_blank"} or [iOS](https://forums.tomsguide.com/faq/how-to-change-the-auto-lock-time-in-ios-11.19693/){:target="_blank"}.
2. Where possible, also disable the _Adaptive brightness_ (or Auto-Brightness) of your phone. We want to make sure the screen is visible through the paper. For **Android**, you can most likely change this in _Settings > Display_, and for **Apple** devices, this is often in _Settings > General > Accessibility > Display > Auto Brightness_.

Don't forget to set the screen brightness to 100% and, of course, plug in a charger!

### Connect it to the Google Sheet
On the phone,
3. Go to [www.phonegrown.site/phone](http://www.phonegrown.site/phone){:target="_blank"} and enter your _Phone Grown ID_ which you can find in the top of your Google Sheet at the _Home_ tab.
4. You should now be connected! If your phone supports it, you can click on _Toggle Fullscreen_ to go fullscreen.
5. On the Google Sheet on your laptop/computer, go to the _[BG] 1_ tab (see bottom of the webpage), and click on _test_ in the top left. Did your phone's screen change colour?

That's it!

## Step 3: add some data
> _For this step, we only need the laptop/computer, and possibly a parent/guardian if you are 18 or younger._

{% include image-gallery.html folder="/assets/images/instructable/step3" %}

There are various ways in which we could let your phone respond to different types of data, but in this tutorial, we will be using a website called [IFTTT](http://www.ifttt.com){:target="_blank"}, or "If This, Then That". This website allows us to create connections with different types of data, which they call _Applets_. Lucky for us, they support Google Sheets! With a free account, we can make up to three of these _Applets_. If you don't have an IFTTT account yet, you can sign up at [ifttt.com/join](https://ifttt.com/join){: target="_blank"}. _Note that through IFTTT.com you might need to log in to other services (such as Google). Read more on IFTTT's privacy policy and Google's advice on third party access._

### Create a weather applet
On IFTTT.com we can create _applets_. These are little recipes that tell the IFTTT service what to do. An applet consists of a _Trigger_ that 'triggers' when something happens, and an _Action_, that 'acts' when that happens.

For this tutorial, we will create two _applets_ that will both influence the phone. One will look at your local temperature, and the other will let you respond when you send your smart display an email. First, let's set up the weather applet.

First this:
1. On IFTTT.com, go to [_Create > Applet_](https://ifttt.com/create/){: target="_blank"}.
2. Click on **_If This_**, and search (and click) for _Weather Underground_.
3. Choose the _Current temperature rises above_ trigger, and fill in the details. For example a temperature of 12 degrees Celsius at your hometown. Press _Create Trigger_ to save this.

Then that:   
4. Click of **_Then That_** and search (and click) for _Google Sheets_.
5. Choose the _Add row to spreadsheet_ action and fill in the details. These details need to be very accurate (_At this point, you might need to approve IFTTT access to your Google (Drive) Account to read and write to the Google Sheet_):
    1. **_Spreadsheet name_** should be identical to the name of your copy of the Google Sheet we made earlier. You can find (and, if you want, change) this name on the very top left of your Google Sheet. _If you haven't changed it yet, it will be something like 'Copy of Phone Grown'_.
    2. Remove everything in the **_Formatted row_**, and replace it with something more readable, such as _'temperature'_. **Write this name down somewhere, we will need it later.**
    3. Remove everything in the **_Drive folder path_**, and replace it with the name of the folder you moved the Sheet into, for example, _'phonegrown'_.
6. Press _Create Action_, then _Continue_, and then _Finish_ to finish your Applet!

It should now show you a _Connected_ Applet. Nicely done.

### Create an email applet
Now, we will set up the Space Station applet. These are the same steps as above, but for the **_If This_** we now look for _Email > Send IFTTT any email_.

First this:
7. On IFTTT.com, go to [_Create > Applet_](https://ifttt.com/create/){: target="_blank"}, Click on **_If This_** and search (and click) for _Email_ followed by _Send IFTTT any Email_ trigger.

Then that:   
8. Click of **_Then That_** and  search (and click) for _Google Sheets_ followed by _Add row to spreadsheet_ action and fill in the details. These details need to be very accurate:
    1. **_Spreadsheet name_** should be identical to the name of your copy of the Google Sheet.
    2. Remove everything in the **_Formatted row_**, and replace it with something more readable, such as _'email'_. This needs to be different than the other applet you created. **Write this name down somewhere, we will need it later.**
    3. Remove everything in the **_Drive folder path_**, and replace it with the name of the folder you moved the Sheet into, for example, _'phonegrown'_.
9. Press _Create Action_, then _Continue_, and then _Finish_ to finish your Applet!

Great! We should now have two IFTTT applet that both tell your Google Sheet when something happens. We won't be able to see any effects fromt the weather applet the temperature actually rises, but we can test the email applet!

10. On the _Home_ tab of your Google sheet, enter the names you used for the **formatted rows** in your IFTTT applets, in the first rule the _'email'_ and the second rule the _'temperature'_ one, and activate the rules by ticking the tickboxes under _Activate_. _The background colour of the rules should now turn orange._
11. Using your Google email account, send an email to _trigger@applet.ifttt.com_. _It will recognise your email, since you logged in to IFTTT with Google._ The subject and content of the email don't matter.
    1. Give it a minute or two, and check the _[Data] History_ tab on your Google Sheet. Do you see your email entry shown?

That's it! Now let's prepare the screen itself.

> If you do not see an email entry with timestamp in the _[Data] History_ tab, but do see it in the _[Data] New _tab, press the purple Setup button, and try again by sending another email another email. If you don't see any text coming into your Google Sheet, double check the details of the email 'applet' on IFTTT.com, and make sure the folder path and name of the Google Sheet are identical.

## Step 4: draw a display
> _For this step, grab your phone, a piece of thin (or standard printing) paper and a pen or pencil_.

{% include image-gallery.html folder="/assets/images/instructable/step4" %}

What we like about smart displays is that they add something visually to the home. They can tell everyone in the home when something is happening, without a loud 'beep' from someone's phone. To make sure your smart display fits your home, skills and style, we will create our own! Instead of fiddling digitally, we are going to create a drawing, physically. If you are doing this tutorial with the family, try to get everyone to add something to it! Before we draw, we first need a holder for our phone.

### Decide how to display your smart display
To make sure that your smart display can be seen from different places in the room, we need to make it stand vertically. This is entirely up to you and depends on where you want to have it. _With permission of your parent or guardian_, you could for example hang the phone on the wall with some hooks and wire, attach it to your fridge or perhaps place it in a phone stand. Either way, **_make sure the phone is plugged in and charging_**. If you don't have a phone stand, we found and followed a quick and easy [tutorial on folding a phone stand](https://youtu.be/mW5M6cepIBI){: target="_blank"} out of an A4 sheet of paper by Wellington Oliveira (@Easy Origami) on Youtube. It takes no more than 10 minutes and fits nicely with the paper drawing in the next step.

### Start drawing
At the end of this tutorial the phone will highlight areas of your drawing to indicate something happened, or in our case, when the temperature rises and when the ISS passes over. Think about a drawing that could represent both of these things at the same time, or perhaps create two separate drawings on the same paper. The drawing doesn't have to be literal, it can also be abstract - anything you want really! Since the background highlights will be quite colourful, we suggest sticking to a line drawing with a pen or pencil. Don't worry about getting it right the first time, you can easily try a few drawing or change the drawing later!

1. Once you have found a stand or location for your phone,
2. Place a piece of white paper a bit larger than your phone, over your phone. _Use thin, standard copier thickness (~70/80gsm) so that the phone's screen can shine through_. Roughly mark the corners of the screen with some dots.
3. Take the paper off the phone, and start drawing! You can use the marked corners to know where the screen lights up later on.
4. Place it back in front of the phone, and press _Clear Phone_ on the _Home_ tab of your Google Sheet.

_You can always come back and change or redo the drawing if you feel like it!_

## Step 5: create and connect backgrounds
> _This step is on the laptop/computer, but keep your phone and drawing close by._

{% include image-gallery.html folder="/assets/images/instructable/step5" %}

All that is left to do is to highlight your drawing when the data says something is happening. Using the Google Sheet, we will now indicate which areas should light up, and in which colours, using _backgrounds_. Let's first focus on the part of your drawing that indicates the high temperature.

### Design two backgrounds
Once you have the Google Sheet in front of you:
1. Go to the _[BG] 1_ tab (on the bottom) and change the background colour of the cells/squares within the 'phone frame' that roughly corresponds with the part of your drawing that has something to do with the weather.
    1. You can do this by selecting (_click and drag_) the cells/squares, and clicking on the _fill colour tool_: the little _paint bucket_ in the toolbar.
    2. The colour is totally up to you! You can even give different cells/squares different colours.
2. Click on the _Test_ button to test the colours on your phone. Adjust the background and keep testing until you are satisfied.
3. Now, do the same for the email applet, on the _[BG] 2_ tab (on the bottom). Repeat the steps above but now focus on the parts of your drawing that have something to do with the emails.

_On the phone, if two or more backgrounds are shown, overlapping coloured cells/squares will mix their colours. If you don't want this, leave the cells/square black if you use them in another '[BG]' tab._

### Connect the data to the backgrounds
With your backgrounds ready to go, we need to tell the Google Sheet which one to show on your phone when something happens, the rise in temperature or receiving an email. _We have done this partially in step 3.10._ On your Google Sheet:


4. Go to the _HOME_ tab (on the bottom) and fill in the dotted cells/squares for rule 1 and 2.
    1. _In the first dotted cell_, enter the name that you entered for the _Formatted row_ for your email and weather 'applet' in Step 3, for example, 'email' for rule one, and 'temperature' for rule two. **This needs to be exactly the same**.
    2. _In the second_, choose the background you created for the weather, most likely _[BG] 1_ and _[BG] 2_.
    3. _In the third and fourth_, enter how long you want these backgrounds to show on your phone when an applet 'activates'. _For example, if 'temperature' then show '[BG] 1' for '20' 'minutes'_.
    4. _Activate_ the rules by ticking the left tick-box on the right.

_If your click on the most-right tick-box you can test a rule. This will pretend that the data was received by the Google Sheet, and instruct the phone to show that background for the duration that you indicated. If you want to 'undo' that test, click on 'Clear Phone'._

## Step 6: Enjoy and experiment!

![alt text](/assets/images/instructable/step6/Step 6.jpg "text1")

Your smart display is now ready to go! Place it in a location where you and your household can see and notice when different backgrounds are triggered. Of course, you can experiment a bit more with different types of data using IFTTT, different drawings and different backgrounds. Just follow the steps above for any of these if you'd like.

Also, at any given time, you can visit the Google Sheet and browse through the _**[DATA] History**_ tab. This will show you all past times when one of your IFTTT applets told your Google Sheet that something happened.

### Other features
There are a few additional options and features you could explore:
- You can create **more backgrounds** (up to 10) by clicking the blue _New Background_ button on the _Home_ tab. You can reset a background by clicking on the green _Clear_ button on the background tab itself.
- You can **set times for the phone to 'turn off'** by changing the _from_ and _to_ times in the 3rd, green, bar on the _Home_ tab. During these times, the phone will not respond to data and only show a black screen. _This might be useful for during the night when you don't want your smart display to light up_.

### Data suggestions
There are a lot of things you could use your smart display for, and because of that, you might not see the wood for the trees. With IFTTT, some _applets_ are designed to work with specific devices and brands. We have listed several things that we think might be a bit more relatable and more common to use. Have a look at these, but foremost, explore, try out and be creative!

_For example_, you could let your smart display show ...
- when the [weather changes](https://ifttt.com/weather){:target="_blank"},
- when you leave or enter an area based on your [GPS location](https://ifttt.com/location){:target="_blank"},
- when it is a certain [time of the day, week or month](https://ifttt.com/date_and_time){:target="_blank"},
- if there is a new song on [Spotify](https://ifttt.com/spotify){:target="_blank"} or [Deezer](https://ifttt.com/deezer){:target="_blank"},
- if there is a new video to watch on [Vimeo](https://ifttt.com/vimeo){:target="_blank"}, [Youtube](https://ifttt.com/youtube){:target="_blank"} or [Twitch](https://ifttt.com/twitch){:target="_blank"},
- when you have a new email with [Office365](https://ifttt.com/office_365_mail){:target="_blank"},
- a reminder that you have 15 minutes left before an event on your [Google](https://ifttt.com/google_calendar){:target="_blank"}, [Office365](https://ifttt.com/office_365_calendar){:target="_blank"}, or [iOS](https://ifttt.com/ios_calendar){:target="_blank"} calendar,
- when someone spends money on their [Monzo bank](https://ifttt.com/monzo){:target="_blank"} account,
- when a blog or news website publishes a new article using their [RSS feed](https://ifttt.com/feed),
- tracking sports goals using [Strava](https://ifttt.com/strava){:target="_blank"} or [FitBit](https://ifttt.com/fitbit){:target="_blank"}
- social media activity on [Facebook](https://ifttt.com/facebook){:target="_blank"}, [Twitter](https://ifttt.com/twitter){:target="_blank"}, or [Instagram](https://ifttt.com/instagram){:target="_blank"},
- messages on [Telegram](https://ifttt.com/telegram){:target="_blank"} or [Android](https://ifttt.com/android_messages){:target="_blank"} phones.

If you have a smart device, you could connect your smart display to your ...
- [Amazon Alexa](https://ifttt.com/amazon_alexa){:target="_blank"} or [Google Assistant](https://ifttt.com/google_assistant){:target="_blank"} smart speaker,
- [Wemo](https://ifttt.com/search/query/wemo?tab=services){:target="_blank"} smart plugs or equipment,
- and many other things!


### Deleting your smart display
When you are finished with your smart display, you can easily undo the web app, Google Sheet and phone connections.
1. In the Google Sheet, go to _Tools > Script Editor_. On this new tab’s menu bar, go to _Publish > Deploy as web app_ and choose _Disable web app_ in the top right of the popup.
1. On your phone, go to https://www.phonegrown.site/phone. If it is connected to your Google Sheet, press _Reset Connection_.
1. For any data (or ‘applets’) you made wit IFTTT, go to IFTTT.com and ‘_disconnect_’ these applets.

You have now removed any connections we have set up in this tutorial.

### More info
If you are curious about the background behind this project, how your privacy is ensured or how the smart display works, visit [www.phonegrown.site](https://www.phonegrown.site/#more){: target="_blank"}.
