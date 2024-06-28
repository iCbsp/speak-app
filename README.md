# Asistentes sin barreras

## About

Android application that solves communication issues between people and voice assistants. Created using Ionic, Angular, Cordova, Capacitor and other technologies.

You can watch the current status of the application on [this video](https://youtu.be/T9wz_-l42aY), it is a tour around the application in spanish.

## Building on web and android
### Building (first time)
- Install node (v20.13.1) (npm v10.5.2) (capacitor v6.0.0)
- Download the repository
- npm install -g @ionic/gli (v7.2.0)
- ionic serve
### Compile and execute Android App (First time)
- Install Android Studio
- npm install @capacitor/android
- npm run build
- (npx cap add android)
- npx cap sync (or npx cap run android)
- You might now encounter problems with gradle version, this might help:
  - Also install and select GradleJDK: jbr-17 (JetBrains Runtime version 17.0.10)
  - build.gradle > dependencies > "classpath 'com.android.tools.build:gradle:8.X.0'" (8.4.0 or 8.2.1) and "classpath 'com.google.gms:google-services:4.4.0'"
- run it from Android Studio, either in a virtual or a physical device
### Once all configured
#### Web
- ionic serve
#### Android
- npm run build; npx cap run android
## Publishing on Google Play
### Google Play Console
Create the app in https://play.google.com/console/
### Creating a signed bundle
- ionic build --prod --platform=android; (npx cap sync)
- Android Studio > Build Variants (left panel) > set the ":app" module to release
- Android Studio > Build (top) > Generate Signed App Bundle


## To do

- Finishing the app.
- Internationalization (available in English).
- Release it in Google Play.
- Take a look for an iOS version.
- Commenting the code and translating it to English.

Let me know if you want me to speed up any of this tasks or if you have any other suggestion.


## MIT License

Copyright © 2021 Carlos Santiago Portas. Contributors: Sergio Luján Mora and Sergio Meliá Beigbeder.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
