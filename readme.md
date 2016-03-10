# What is it for ?
Nickel elements is a set of elements which makes it easier to build hybrid mobile app with Polymer.

# How does it work?
The resulting hybrid app is hosted by a WKWebview, with a bi-directionnal bridge between JS and Swift. Native features are build in Swift and are provided by the NickelSwift library. Native elements uses the bridge to communication to their native "backend".

# What's inside?
Nickel elements provides web components which enable access to the device native features such as :
* Photo gallery picker
* Native data storage using Realm Swift
* Text-to-speech
* Audio player
* Load native embedded resources
* Local notifications
* Native timer
* Keep screen on

It contains also useful elements for user interactions or utilities such as :

* Wheel picker
* Rating element
* Modal view
* Internationalization

# How to use it on iOS?

* Create a native iOS app in XCode using Swift
* Create a pod file and add NickelSwift to dependencies
* Let the main view controller extend **NickelWebViewController**
* Create a folder for the webapp
* Install *nickel-elements* from bower
* copy the gulpfile from the *demo* and adjust paths for your project
* Open te main view controller, and on the *viewDidLoad* method, define the main page with *setMainPage* to the output of the webapp build process
* add the webapp build process output as resources to the xcode project
* the app is ready to run
