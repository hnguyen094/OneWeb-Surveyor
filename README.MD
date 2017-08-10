Surveys site for OneWeb's User Terminal (UT) products.

Contains multiple projects (approaches to the problem).

## **graphics**

This folder contains all my created graphics with .pdn extentions (paint.NET) as well as the outputs in .png extensions. 
Often, the one without dates are the latest ones.

To edit, download [paint.NET](http://www.getpaint.net "paint.NET download page") here

## **SurveyorJava**

This is the native Android implementation of this project.
Currently, it has

| Features | Android | iOS |
| ------- |:----:|:---:|
| User Interface | No | N/A |
| Live Camera | Yes | N/A |
| Rotational Sensor | Yes | N/A |
| Stitching | No | N/A |
| Data | No | N/A |

## **SurveyorNS**

This is the NativeScript implementation of this project. Hopefully, this means that there will be cross-platform support with iOS.

Features | Android | iOS
--- | --- | ---
User Interface | No | No
Live Camera | No | No
Rotation Sensor | Yes | Yes
Stitching | No | No
Data | No | No

## **v2SurveyorNS**

This is the 2nd NativeScript implementation of this project. The last one had structural issues due to a non-standard NativeScript layout.
Therefore, this version is a cleaner & working version of its predecessor.

Features | Android | iOS
--- | --- | ---
**UX** (aesthetics) | Yes? | Yes?
**UI:** Crosshair to elevation | Yes | Yes
**UI:** Levels of elevation | Yes | Yes
Live Camera | Yes | Yes
**Accuracy:** Camera | Yes(?) | Yes?
Rotation Sensor | Yes | Yes
Data | No | No
**Accuracy:** Data | N/A | N/A

#### Notes:

Endings are CRLF because the project was developed in Windows. If you're working on Mac or Linux, and is encountering line ending issues, use:
$ git config --global core.autocrlf input
and checkout again. I think this could be an issue because I kept getting this when committing to git:
https://stackoverflow.com/questions/5834014/lf-will-be-replaced-by-crlf-in-git-what-is-that-and-is-it-important
