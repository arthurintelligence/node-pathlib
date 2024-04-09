# node-pathlib

### _A port of Python PEP 428, the pathlib module, to node_

<p>
  <a href="https://github.com/arthurintelligence/node-pathlib/">
    <img alt="SemVer" src="docs/badges/semver.svg">
  </a>
  <a href="https://github.com/arthurintelligence/node-pathlib/">
    <img alt="Engine/Node Support" src="docs/badges/node-version.svg">
  </a>
  <a href="https://arthurintelligence.github.io/node-pathlib/lcov-report">
    <img alt="Code coverage: Lines" src="docs/badges/badge-lines.svg">
  </a>
  <a href="https://github.com/arthurintelligence/node-pathlib/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/github/license/arthurintelligence/node-pathlib">
  </a>
  <a href="https://snyk.io/test/github/arthurintelligence/node-pathlib">
    <img alt="Snyk: Security Score" src="https://snyk.io/test/github/arthurintelligence/node-pathlib/badge.svg">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="Code Style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat">
  </a>
</p>

## Intro

node-pathlib is a port of the [Python PEP 428, _"The pathlib module"_](https://peps.python.org/pep-0428/) to NodeJS.

## Justification

The `pathlib` module offers a natural, higher level API than that offerred by the `node:path`
and `node:fs` native libraries. While it is not entirely possible to reproduce the pathlib module due to the lack of operator overloading in Javascript, this package did its best to represent accurately the interface
offered by its Python counterpart.

## Documentation

Documentation is available [here](https://arthurintelligence.github.io/node-pathlib).
