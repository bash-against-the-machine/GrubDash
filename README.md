# GrubDash

Did I use AI tools?
- I used Perplexity AI tool to troubleshoot errors that I received on statusIsValid, and update() functions in orders controller
file.
- I used Perplexity AI tool to troubleshoot error in priceIsValidNumber function in the dishes controller file.

In both cases there was just a minor syntax error to where my functions were validating whether something was false and if it was
to pass that to the error handler. I ended up changing the functions to evaluate if a test case was true to pass it to error
handler.

### Justification of design decision

In all honesty, the design decision was already determined by the initial project scaffolding and it does follow the industry
best practice of:
- **Modularity**: routers are self-contained and could be copied to another Express application and still work or moved within
application and still work.
- **Group-by-resource**: A file organization structure in which any code that handles requests to a resource is stored in a
folder with the same name as the resource, regardless of the URL to that resource.
- **Controller**: a controller file defines and exports the route handler functions with a single responsibility to manage the
state of a single resource.
- **Efficiencies**: application-level middleware runs on every request but router-level middleware only runs when a request
matches the router's path prefix. For example, there is no reason to run `/dish` validation on an `/orders` request.
- **Debugging**: if a bug is found in `/dish` validation, you know exactly where to look. If validations are moved to `app.js`,
it gets more cumbersome to maintain and debug as the app grows.

This type of design uses application-level middleware for things that every route needs and delegates resource specific logic to
their specific routers, making the application more modular and easily maintainable.

### Explanation of debugging approach and reasoning

I personally did not have to do much debugging outside of the the tests. I personally ran the tests to see the errors/failures
before any work was done. This gave me insight on parameters and other considerations I had to keep in mind when writing my
functions. In the end, there were only couple of issues I had that were specifically related to my functions testing if
conditions were false instead of true when it came to generating validation errors.
This is part of the reason why Test Driven Development is so effective. By creating automated tests for each functions not only
allows to critically think through each functions that developer writes, but also reduce debugging time in the future.

### Description of how my solution handles errors and edge cases

My solution handles errors and edge cases in multiple ways:

- **Input Validation Middleware**: before any handler runs, router-level middleware functions validate incoming request using
`next({ status, message })` call with an error object if something doesn't validate.
- **Resource Validation Middleware**: `orderExists` looks up resource by `id` before any read, update, or delete handlers are run,
calling `next({ status: 404, message })` if not found.
- **Application-level Error Handling**: I have a centralized error handler that collects errors from all those `next({ status,
message })` calls.

Bottom line, the error messaging is specific and accounts for users not adding required values such as `deliverTo` or
`mobileNumber` as well as non-existent `id`s and incorrect values for order status. It's important to know what data the
application will accept and what data will not not work and validate from there. If application accepts a small list of choices,
ensure error handling validates only those choices. If application is only going to accept specific data type, make sure the error
handler validates that particular data type was submitted. Do not forget about null or undefined values!

### A process log outlining key milestones during your development

I did not keep a detailed log of what I exactly did line by line. However, I did regular commits as modules were completed.

Here's the output from my `git whatchanged` command:

```
commit 66e4db42a3e5d5fab166fb8cfff58256bf5927e2 (HEAD -> main, origin/main)
Author: bash-against-the-machine <davidsvolkov@protonmail.com>
Date:   Mon Jun 8 17:26:33 2026 -0700

    added AI tools usage explanation to README.md

:100644 100644 87f13a7 f543aca M        README.md

commit 5a81e28c3809c3fd12abd0d10ccad5db44ae8d34
Author: bash-against-the-machine <davidsvolkov@protonmail.com>
Date:   Mon Jun 8 15:37:44 2026 -0700

    completed orders router, successful completion of all tests

:100644 100644 3dc2ddc 768652a M        src/orders/orders.router.js

commit 3a5f61ae94a0626f95aec9c3b3f8e2059fef7f4c
Author: bash-against-the-machine <davidsvolkov@protonmail.com>
Date:   Mon Jun 8 14:25:16 2026 -0700

    added functions and and error checking to orders

:100644 100644 b18dbd8 964b5ea M        src/dishes/dishes.controller.js
:100644 100644 5613010 c18cee3 M        src/orders/orders.controller.js

commit 080c7026832d2759a18403dd3d0c217c1272f4f4
Author: bash-against-the-machine <davidsvolkov@protonmail.com>
Date:   Mon Jun 8 14:16:30 2026 -0700

```

### Evidence of your individual and original contributions

In today's day and age, unfortunately it is harder and harder to prove original contribution and not the work of AI. It can also
be argued that because code has specific syntax requirements and frameworks, there's really very little originality in coding.
I've also adhered to development best-practices when creating variable and function names, so you will not see Marvel superhero
names in order to prove the authenticity of my work. In this instance, I hate to do it, but you're going to have to take my
"Trust me, bro" at face value here. 
