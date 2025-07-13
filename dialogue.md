## 2025.06.10 - [cyc]

EXCITED to start this collaborative work! :）

I just created a basic shader with simple position-based coloring.
The shader uses (chaotic) position transformations with Gaussian 
time modulation for organic movement patterns.

Please check README.md first and feel free to add your thoughts!
Looking forward to seeing how you'll respond to this foundation!!!

## 2025.06.11 - [ayumu]

The concept is nice! Clear and well-instracted!
And already the visual is cool😂 Wave manupulation and gaussian blurring feels like magical mathmatical phenomena.
I did minor tweek on output image like modulation, color control with pow().
Today was cloudy/rainy in Tokyo, so I felt like I need a bit of bright/colorful image.


## 2025.06.11 - [cyc]

(was worried yesterday but I'm so happy you like this!😂)

→ js: Added a high-resolution image download feature today! Just press s/S on the screen and you can download the high res image!

→ record folder: Since we can download images now,
I also created a folder to store all the downloaded pictures as a record.
Actually, we can share any files we want!

→ shader: I think the bright colors look amazing!!!
And today I wanted to add a little emphasis to the ripples, so I changed a bit on the color function again.
The screen now has a bit more contrast.
out_0611_01 and out_0611_02 are the beginning and after shots respectively.
I'm not satisfied with how the ripples stack up after a while though.
I need to think about what to work on tomorrow...

Yesterday I got my Fuji film photos 🎞 from last year, and I'm really happy with how they turned out...
I guess I really love highly saturated images.

## 2025.06.12 - [aym]

Thank you for organizing utilities!
Just having fun
I noticed that the stripes got stronger over time, so I changed time to oscillate cause I also really love initial state of gradation :)
Now the pitch of stripe goes back and forth along time.
And added some color modulation to keep complexity in color gradation.
Also added another uv offset like mosaic-patterns.
Let's see if all of them work together...

## 2025.06.12 - [cyc]

I'm late!

I absolutely love the mosaic pattern!
If you take a closer look at the edges in this version, there's this subtle beauty around the perimeter that feels really nice ✨✨
It alo makes the color changes in the center much clearer to see
Amazing!!

I didn’t actually change any color palette today - I'm trying to simulate Caustics to make the ripples on screen more delicate...
Though I haven't finished the area change calculations yet, I should be able to complete it tomorrow
I think we can working on color adjustments next - all the colors 🌈 are currently competing for attention, maybe it's a bit (too) chaotic?
Temporarily comment out the sampleOffset in main() - it was too intense, wanna creating more organic ripples now... 🌊

Caustics reference: https://github.com/shanecelis/water-demo/blob/master/Shaders/Caustics.shader

## 2025.06.13 - [ayumu]

Gorgeous causitics! Organic fluiditiy, complexity
I tried warping rgb to see another possibitlity of color pallettes.
Now it changes color along time, but then it gots awkward black spots😂.
Let me see if I can do anything...
And really minor thing, I added a gray frame with CSS.

## 2025.06.13 - [cyc]

I think I love the colors more and more
The current light and dark areas have this dimensional quality, 
and in some moments it's starting to look like oil painting! 🎨✨ (and we have a frame now 😂)
I tweaked the sampleOffset at the edges a bit to add some variation to the edge mosaic effect 🔧

And for color...
I'm guessing the "black spots" you mentioned are those areas with extremely dark(black) colors?
I also adjusted the achromatic transition states while the animation was at it 🌈

The downside is that the colors get more and more vibrant over time (saturation keeps increasing 📈📈📈 )
I'll control the time between a specific range later and fine the colors a bit more

## 2025.06.14 - [cyc]

Just a quick note

I've updated:
1.Fixed the over saturation algorithm/overly rapid transitions 🔧
2.Changed col0 & col1 to random r/g/b combinations so the colors are different every time. 
Also simply displayed them below the canvas - if you see any color palette you like, feel free to record them... 🎨📝
3.I like brrbrg/rrbrgb

p.s.1 Do you think we should have another pre-meeting on Monday?
p.s.2 Have a wonderful weekend with 🎉✨🐕!

## 2025.06.14 - [ayumu]

Color looks so nice! And generativce (variation) system!
I'm always surprised how you introduced brand-new code.
Today I just add another uv warp like tunnel. It uses distance-reversing from a center point. 
I hope you also have a cozy weekend🕊️

P.S. For me all good to just keep up this dialog based communication instead of the mtg.
Because literally I am just only reacting on what I feel from the code status.

## 2025.06.15 - [cyc]

Your modifications remind me of lens code - maybe we could do some lens variations too! 🔍

I hit a bit of a creative block today on what to do next, so I reverted the colors back to their initial state 
Simple is beautiful - I think doing some subtraction with the code is good too 🎯
I added random mixing coefficients for the existing two Gaussian points so each initial pattern looks more different every time ✨

The dialog approach is totally fine! I think this kind of dialogue is really great...
I have some exhibition setup ideas - we can look at them together on Wednesday 💭

## 2025.06.16 - [aym]

What a gorgeous look! Now the gradation is so smooth without any extream spots.
And small grained disther makes it more authentic🎨
This is already a piece of something to exhibit...
Today I added a shadow effect to see 3 dimentional look like a real picture.

## 2025.06.16 - [cyc]

I first fixed the coordinate system so the pattern looks more different now (not always starting from the left-top corner anymore)
Then I added lens calculation on top of your distance function, 
making it synchronize with your distance function to have lens-like variations
I think the shadow effects you added work really well - they give this piece dimensionality from all angles...

I'm so happy you said "This is already a piece of something to exhibit..."
It also gets me excited thinking about how to present this kind of process 💭❔

## 2025.06.18 - [aym]

Thanks for organizing as always📐
I was absent yesterday sorry!
Today I added 3 variations of warping.
Let's discuss later about insatallation plan and wrap-up current status today on the weekly mtg!

## 2025.06.19 - [cyc]

No worries, I overslept and miss one day too! I think we're pretty flexible!
Today I added lens calculation for other 2 variations!
When I woke up, I found out the last thing I Googled was "What to do if I'm always sleepy" 😂😂 
Yesterday's meeting felt so real - Excited and like it was actually happening
Let's keep having fun and get this thing done!🙌

P.S. Silver Trail's new 3D view mode is so cool! Definitely love it!

## 2025.06.19-2 - [cyc]

I added two random center points to the color formula today, hoping to get more variety in the color palette
Also slow the ripple timing a bit to make the overall ripples look slightly calmer
Sometimes the canvas looks like a landscape painting - It's really nice!

## 2025.06.20 - [aym]
Interesting! I was surprised you put actual lens distortion effect on my kinda wired idea🙏
And your story is so hilarious. If I feel even the slightest bit sleepy, I go to bed.

From yesterday, I was pretty struggling to use derivertive functions (dfdx and dfdy) in p5js.
Now I overcome with dirty solution... I hope it doesn't mess up bad😂
Just I wanted lens to have actual thickness, and have shaddow on it.


## 2025.06.20 - [cyc]
I messed sampleOffset today and the circles one works the best!
The square-divided one have a bit of an oil painting effect, and the diagonal lines effect...I don't like it 😂

About Silver Trail (which is totally fine, don't worry 😂)
- our original system rules seemed to require going through the center point of the canvas,
but I'm worried this might make the patterns too uniform
Maybe we should simply use the 'merge to one point' concept instead? 🤔
Also, what are your thoughts on the color palette? 
I feel like your style is cool/black&white, mine is rainbow colors (oh no!)

## 2025.06.23 - [ayumu]

Sorry to be late, 
Right, center point one seems going to be dull in composition-wise.
Should we have quick chat?
In stead of haveing one single center point, how about giveing one or more random points to be shared. Let's say "we share random intersection point(s)".
And color pallette(s), they also could be shared.
In color theme I can be flexible/correspond to yours.
I tend to go black background + high contrast (with additive blend...), but it's not required.
Somehow I remember I tried silver-ness in that way🐩


## 2025.06.24 - [cyc]

Sorry to be late 2! 
I've been rushing to test Silver Trail lately, so I'm a bit behind on Dialog 2025
I think I'll finish the new point system we can share together tmr, and let's see what Silver Trail looks like after that!
I tweaked the caustic and offset a bit and reapplied them, found that too much screen division can sometimes be overwhelming to eyes 👀
I feel like we're getting close! 

p.s. Even though the process can be tiring sometimes, you always show me new possibilities, especially how to combine and balance 2d&3d feelings of canvas - I'm having so much fun😊!

## 2025.07.06 - [ayumu]

It's been a while since I last updated! I'd like to start updating again. Today, I added animation to the shading I added previously.
The extreme heat and busy days are upon us, so please take care of your health. Tokyo is just... so hot...

## 2025.07.12 - [cyc - jet lag version]

Thanks for the caring! Please stay healthy too!
Last night opening was amazing - you worked so hard! Ty!

I'm tired today, just want to tweak the numbers in the existing formulas...
0.1, 0.01, 0.001... to see if I can get some interesting output
Turns out I think I discovered some holographic gradient style - what do you think?

I think we can do " me -> you " 2 people both updates counts to one round, then push it to the exhibition LED display 🔄

Feel free to leave me a message if you want to discuss anything!

## 2025.07.14 - [ayumu]

It's been busy! I'm relieved that we've managed to open it.
It's a good idea to explicitly indicate the conversation rally.
I hope I can enjoy this process for a little while longer during the exhibition.
Today I adjusted the shadow contrast to increase the variety of colors.