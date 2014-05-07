# noisette.js
> A promise based interface to phantom.js, named after a coffee drink, because it seemed like a good idea at the time.

## Getting Started
Firstly, make sure phantomjs is installed on your machine:
```shell
npm install -g phantomjs
```

Then start using it in your project
```Javascript
var Noisette = require('noisette');

new Noisette({
	site: 'http://127.0.0.1',
	width: 1366,
	height: 768
}).then(function(browser){
	browser.visit('/buttons').then(function(){
		return browser.dom()
				.find('button')
				.get(0)
				.click()
				.wait(200)
			.exec().then(function(){
				browser.capture('screenshot-1.png');
			});
	}).finally(function(){
		browser.close();
	});
});
```

## The Browser
### ```noisette.visit(page)```
Points the browser to a url. If the site option is used when creating the object instance, this url is constructed as *site*+*page*, with *site* defaulting to an empty string.
### ```noisette.resize(width,height)```
Resizes the browser window on the fly, for testing them media queries and such.
### ```noisette.capture(path)```
Sometimes headless testing can be frustrating. You can use this to take a peek under the hood and see how your page is doing. Set *path* to the file path of the png file you'd like created, relative to the running script. If you want to create _screenshot-1.png_ in folder _./captures_, call it like this:
```Javascript
browser.capture('captures/screenshot-1.png');
```
### ```noisette.close()```
This function shuts down the whole operation. If the memory on your machine starts running low, it's because you forgot to call this function after you were done.

## Talking to the Browser
### ```noisette.eval(function)```
Injects a javascript function within the page scope and calls it. Whatever it returns comes back as the first parameter in your next _.then_ statement. You can only pass data that can be serialized into a JSON object.
### ```noisette.dom()```
Basic DOM manipulation and navigation can be done by creating a DOM Stack. Stacks are preceded with *noisette.dom()* and concluded with *.exec()*, returning a promise that can be chained. Check the **Getting Started** section for an example. There's a full dom manipulation library injected inside the browser, but I've only exposed the ones I've tested thus far.
+ `find(selector)` returns all the nodes found on the page matching the css selector
+ `get(index)` usually used with find, grabs the node at _index_ of those matching the find
+ `fill(text)` puts text into _input_ and _textarea_ fields
+ `click()` throws a click event
+ `wait(duration)` pauses the stack for a certain _duration_ in ms

## Talking to Noisette
This is currently a half baked idea to call out from inside the browser instance. I needed it to tell the noisette instance when async javascript functions completed in the browser and for when the DOM Stack was initialized. There _could_ be something cool in developing this, but I can't see it yet. You can take a picture from within your page by calling:
```Javascript
window.callPhantom({
	system: 'take_a_picture',
	data: 'captures/screenshot-1.png'
});
```
3 MeowMeowBeenz for the first to develop a dynamically injectable module system on top of this.

## Contributing
I got a real job, so don't expect instant response times, but feel free to submit pull requests, issues, etc to this project. I _kind of_ follow the AirBnB [style guide](https://github.com/airbnb/javascript), but if it lints and doesn't look like your cat typed it, consider it accepted.