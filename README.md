# [POKÉDEX](TASK.md) by Vladimir Shein
---
#### Intro and status

demo https://bitbucket.org/sonnanhaft/pokedex-honeypot

Hi, my name is Vladimir, if you are reading this, you are checking my test task progress.
I've prepared partly complete pokedex, accordingly to task rules. Not everything is perfect
but I'm proud, at least because I've complete task quickly (around 8-12 working hours at this step)
and from javascript point it looks very clean.

What is not ready? Much of "pixel perfect" styling - I'm not a markup-boy, I'm a js dev, so unfourtenately I don't like tons of markup - can't do it very quickly (comparing to js).

---
#### How it is build?
It is an AngularJS + Gulp + some test sample on jasmine and on protractor.
Gulpfile - my recepiet - very very fast gulp build for fast development - it is so fast that I don't really know sometimes if "it worked" or should trigger one more time (ofcourse always it worked).
I've decided not to use any css frameworks (tired of them and task is small) and thats it, thats what I've done.

## What is not perfect

World is not perfect). No, honestly, for infinitive scroll I've used ui-scroll plugin - and I have experience with it - it is not perfect, so if u see scrolling defect - thats it's fault.

## Next steps?

If I have time, before x-mas (and I don't), I'm going to make styles more looking like in specs, especially on 2nd page.

## How to run?

I've added bin folder, as in task, but if you have any troubles with this bin files (for example your system is incompatible with this bash/bat) then in your console run:
```
npm install && npm install -g gulp && npm install -g bower && bower install
```
And then to start the app run:
```
gulp serve
```
"serve" in here will run quick develpment server, to build production sources instead of "serve" type "build":
```
gulp build
```
To try my tests instead run:
```
gulp test
```
And finally to try protractor test run:
```
gulp "protractor:jenkins"
```
## Demo
I've hosted demo for this task  on free hositng server for static apps (bitballon - I really like it), so in case when you are not able to build by your own, or you dont' have much time - try this:

http://pokedex-demo.bitballoon.com password: _honeypot_
