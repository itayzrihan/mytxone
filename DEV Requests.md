now lets create the actual workflows one by one, getting started with 50 videos production, when clicking get started, it should navigate the a step by step guide with ai integration (we already has ai integration in the app but we might craft new api for this one)
we rendering the steps one by one with a next button
step 1:
asking the user: Main Subject?
Tell Me More? (in this input the user should alaborate on the content he want to produce, the reason, the cause the principles, the values)
Desierd CTA: (what do you want to achive?)

Step 2:
Paste 1 - 10 Winning Scripts He used before or scripts of others in the same niche (it doesnt have to be scripts thats related to the niche but preffered)

(when clicking next, behind the scenes, we gather all of the info the user have inputed, and pass it to ai with the next instructions:

Give me a list of 50 viral video scripts powerful topics (topics only), after you analyze their hook, message, and the way they keep viewers watching until the end.

The topic is: [User Topic + Main subject + Tell Me More + CTAs]

The example scripts are only for direction and learning — the scripts you create should be unique.

Example scripts to learn from: [user's pasted scripts]

Step 3:
Loading indicator while generating the list, and then show the list each one in its own item, and under it, show a text box empty for each one. 
near each text box there should be generate now button that sends this instruction to the ai and automatically stream the resoponse into the relevant box. {
Give me the most powerful viral video script for this powerful topic (the current generated topic), it should be 20 - 30 seconds long, in the style of the example videos scripts i provide, only after you analyze their hook, message, and the way they keep viewers watching until the end.

More Context: [User Topic + Main subject + Tell Me More + CTA]

The example scripts are only for direction and learning the script you create should be unique.

Example scripts to learn from: [user's pasted scripts]

Make sure that you use the most powerful techniches to craft super interesting and impactful contnet, that you use imagination to provide uniqe pieces and think out of the box for each one. 
)}

Also the user should be able to click a button at the top to generate all of them automatically and they would be automatically continue to the next until finish fulfuling all of the boxes. 

when the generation for a topic ended, save it automatically to the DB one by one. (we already have scripts table in the db make sure to adapt)
then the user should be able to continue to the next step:
next step we instruct the user to film this videos:
For influencers, use teleprompter to paste all of the scripts into one teleprompter session and film all of them in one shoot. 
After a successful shooting of a individual script, clap twice, after failure clap 3 times (this would be super helpful later!)
For faceless you can just paste it inside eleven labs / voice over your self one by one. 

and give them two scripts options, for influencer unite all of the scripts into one long text, for faceless a download button to download docs files / txt files one for each script. 
Then the influencers has next button to continue after they flimed to the next instructions and for the faceless button with more steps coming soon. 
 
 the next step for the influencers is:
 cut the long video to parts, using the claps as indicators for fast cutting
 next step is Automatically add preset of hook animation zoom in slowly + riser + effect at the punch + cut zoom out into the 100 scale (onnly suggestion)

 The Next Step nest each cut with the topic name of the video 

 next step bulk generate thumbnails

 next step bulk generate descriptions for each video 

 next step store the in ordered folders 

 next step make sure they exist in the automation uploading folder if not exist {click here to start new automation (soon button)}