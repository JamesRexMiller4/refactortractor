# RefactorTractor Group Project by Raisa Primerova, Garrett Iannuzzi, and James Miller

## Overview: 

This project had us refactor another group's FitLIT project, testing us by having to familiarize ourselves with a codebase that we had not personally written. We were tasked with rewriting the prior class objects file structure to utilize inheritance, convert the CSS stylings into Sass/SCSS, implement fetch requests, and make the web app completely accessible for anyone with limited abilities using ARIA attributes and semantic html. In addition, this project sought to have us become better oriented with a remote workflow, having to perform code reviews on each other's PRs, provide feedback and discussion where necessary. This project also incorporated Webpack and all the developer dependencies that come with it, allowing for a more streamlined developer environment. 


## The Original before Refactoring : 

![refactortractorOriginal](https://user-images.githubusercontent.com/27719824/67830209-656e9200-fa9f-11e9-8bd9-885a8d27416a.png)




## After Refactoring : 

![refactortractorRefactored](https://user-images.githubusercontent.com/27719824/67830280-a797d380-fa9f-11e9-8b4a-9e7c6e24cbd7.png)

### Light/Dark Mode 

In order to make the website for those with color-blindness and/or limited visibility we decided to implement a light/dark mode, there by preserving the original stylings as an alternative while having a more visibile, and more accessible theme as the default. 

![2019-10-29 23 01 03](https://user-images.githubusercontent.com/27719824/67830415-1f65fe00-faa0-11e9-929b-dd11f5054036.gif)


### Inheritance Class Structure 

In order to dry up our method declarations amongst all the repository classes we created a Parent class and extended the methods across the subclasses, minimizing the file size of our classes and our test suite

Repository Parent Class

<img width="1030" alt="Screen Shot 2019-10-29 at 11 03 55 PM" src="https://user-images.githubusercontent.com/27719824/67830499-7c61b400-faa0-11e9-8b21-22e007986b0e.png">

Activity SubClass

<img width="1030" alt="Screen Shot 2019-10-29 at 11 04 13 PM" src="https://user-images.githubusercontent.com/27719824/67830567-b9c64180-faa0-11e9-9c5d-00c01f877aa4.png">


### SASS 

Our sass files utilized functions, mixins, and variables to create robust and dynamic css stylings. Where applicable we utilize nesting, pseudoelements and pseudoselectors. 


### Accessibility 

One of the objectives of this project was to get the web app passing with an accessibility score of 100% on dev tool audits. We were able to do so, using ARIA role tags, attributes, and creating a tab index that allows all users to tab and interact with all the information displayed on the dashboard 


![2019-10-29 23 11 04](https://user-images.githubusercontent.com/27719824/67830977-5fc67b80-faa2-11e9-9c10-e86c9d3e9368.gif)




