# Hahow Heros API Practice

## 我們該如何跑起這個 server

* Environment: Node.js v15
* Web server address: [http://localhost:3000](http://localhost:3000)

```shell
npm start
```

or if you have installed the docker:

```shell
make dev
```

## 專案的架構，API server 的架構邏輯

In this project, I applied 'Clean Architecture' in this project with layers.

* Application service (aka. use case) layer
    * `src/application-services/`
        * `hero.service.js` handles all use case about `hero` resources, orchestrate the operations between the
          third-party services and our logic
        * `contract/response-handler` is meant for handling the relationship between application services and RESTful
          route (You can refer to "Across Boundary" in _Clean Architecture_).
* IO layer
    * `src/external-resources/` integrates our system with third-party api services
        * `http-request` is a module that wraps the `got` (a npm package for http request) and only exposes a minumum
          necessary interface.
        * `hero-source` is the place we call for heroes data
    * `src/web/` is responsible for our own RESTful API
    

### Design Decision Note

1. the logic of response-handler - I've noticed that there are lots of conditions I need to handle in terms of different http status code. Instead of putting these logics in the RESTful framework, the application service can provide more details for me to handle the exception.
2. why I wrapped the `got` package - It's because first there are too many options you can set in `got` function, I want to make sure that no one would mess up with the options. Second, if I need to upgrade the package, the wrapped interface can make sure no breaking-changes.

## 你對於所有使用到的第三方 library 的理解，以及他們的功能簡介

Here are three main criteria for me to pick a third-party library:

1. Popularity: the amount of star
1. Maintaining status: the last publish date
1. Size: more lightweight, more delight
1. Comprehensive documentation
1. I've used before

All dependencies below meet the criteria!

### Dependencies

* `koa^2.13.1` is a HTTP middleware framework.
    * support `async-await`
    * more lightweight than `express`
    * well-documented
* `koa-router^10.0.0`
    * to define routers for `koa`
* `got^9.6.0` is a tool for simplified HTTP requests
    * support `async-await`
    * popular (over 9k stars)
    * relatively lightweight and well-functional
    * [Alternative libraries to request · Issue #3143 · request/request](https://github.com/request/request/issues/3143)

### Dev-dependencies

* `ava^3.15.0` is a testing framework
    * lightweight
    * clear interface (you should import `test` on your own instead of use a global `test`)
    * fast
    * easy-to-use
* `eslint^7.22.0`
    * a must-use linter for javascript development to debug their code and align with the coding style
* `nock^13.0.11` is a HTTP server mocking and expectations library
    * I use it to do integration testing with the third-party libraries
    * easy-to-use
    * well-documented
* `nodemon^2.0.7` is a tool for the system to hot-reload the problem whenever a js file is changed
    * a must-use tool for quickly debugging

## 你在程式碼中寫註解的原則，遇到什麼狀況會寫註解

To be honest, I don't really write comments in my code, except for four situations:

1. When you need to integrate with third-party services or libraries, I will comment the document url
2. jsdoc for Functions and classes in order to enjoy the type-hint
3. Some tricky business logics which I can't easily see at a glance.
4. Some ugly-looking code with strong code-smell. I will comment it for future improvement.

## 在這份專案中你遇到的困難、問題，以及解決的方法

One of the difficulties I've met is the integration testing of the hahow service. Because I need to make familiar with
the api without clear documentation. Fortunately, there is an API development tool called [Insomnia](https://insomnia.rest/) (like postman in different UI) to test the hahow services.
Also, I have done some api testing using `nock` to make sure I did understand the behavior of the service.

Second one is that I tend to over-design the system because I thought I had already known how to do. But I resisted that impluse, and instead, I used TDD ways to implement the server. Not Until I finished a feature did I refactor the code into the way I desired.
Therefore, I can finish the project in time.

## References

* [got - npm](https://www.npmjs.com/package/got)
* [nock - npm](https://www.npmjs.com/package/nock#replying-with-errors)
* [Elegant error handling with the JavaScript Either monad - LogRocket Blog](https://blog.logrocket.com/elegant-error-handling-javascript-either-monad/)
* [Either Monad — A functional approach to Error handling in JS | by Dimitris Papadimitriou | ITNEXT](https://itnext.io/either-monad-a-functional-approach-to-error-handling-in-js-ffdc2917ab2)
