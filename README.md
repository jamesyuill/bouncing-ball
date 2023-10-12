# bouncing-ball

Built initially to experiment with using vanilla Three.js to create a bouncing ball. Originally when a button was clicked it would generate a ball at a random position on a plane.

I then added a bouncing sound to the balls using Tone.js. I then wanted to speed up the rate at which the ball bounces and thus increasing the amount of times the bouncing sound is triggered.

This then led me to align all the balls (and limit to seven) to create a bouncing arpeggiator. It's possible to select a ball and then change it's note, as well as the rate of each individual ball.

For further tweaking I would love to:

- convert the bounce rate into an accurate bpm counter
- make it so when the ball is selected it remains green so you know which one you're seeing the stats for
- create the ability for a user to upload their own sound file
- create the ability to set each ball to a different sound including an uploaded sound file
- allow a user to upload a longer chunk of audio which is then split into random segments, which are then triggered randomly
