# Custom Form Validation  

This project demonstrates my fully customizable, front-end form validation. When I was first learning how to do form validation I was searching for a way to be able to write a single function that would be responsible for handling a single field in a form, however all of the options given to me (such as native html5 form validation, or the existing open-source validation libraries out there) seemed to be quite limited, and none of them seemed to offer a robust solution that would work for any type of form. I decided to learn how to do validation on my own from the ground up, and this project is the result.

## what's unique about this code?

My goal when creating this project was to stay as DRY as possible. I created a class-based react component which contains a dedicated validation method for each field, however I never explicitly call any of the functions. Instead, I take advantage of the `this['validateFieldName']({...})` syntax to procedurally call any function that looks like a validation method. These methods use identifiers that always start with the word 'validate' followed by the specific field name. All I need to do to add a new validated field is to create the new field in react-state and in markup (specifying the name attribute), and then define the validation function. In addition, I've created a field constructor component which helps me keep all the markup uniform to minimize the possibility to make mistakes (since things are EXPECTED to be a certain way by other parts of the code). This helps me focus just on the business end of my code, and not worry about when to trigger a specific validation method. I've been requested to make an NPM package for this, and I plan to do so in the near future.

To review the code for yourself, please look at `src/pages/SignupPage/SignupPage.jsx`.

## Demo


## technologies used

1. MERN (mongodb, express, react, node.js)
2. React-Bootstrap