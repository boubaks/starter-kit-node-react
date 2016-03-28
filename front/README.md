# Front

A combination of React & Backbone drives and structures the application.

## Installation

Global [npm](https://www.npmjs.org/) dependencies :
```bash
npm install -g bower grunt-cli
```

Project [npm](https://www.npmjs.org/) dependencies :
```bash
npm install
```
[Bower](http://bower.io/) dependencies :
```bash
bower install
```

Ruby gems dependencies (using [Bundler](http://bundler.io/)) :
```bash
gem install bundler
bundle install
```

## Available commands :

To start to develop with livereload :
```bash
grunt serve
```

To build :
```bash
grunt build
```

To build and start a local server :
```bash
grunt serve:dist
```

### The proxy option

You can run the commands with the proxy option :
```bash
grunt serve --proxy
```
```bash
grunt build --proxy
```

The first effect is that the base api url is now `/api` instead of `http://localhost:3000` by default.

The second effect on `serve` and `serve:dist` tasks is to run an applicative proxy between `/api` and the local api server that is specified as `proxy` option value or `http://localhost:3000` by default.

Exampe:
```bash
grunt serve --proxy=http://localhost:8888
```
