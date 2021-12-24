<div align="center">

<img src="https://github.com/techmmunity/serverless-vercel-ncc/raw/master/resources/logo.jpg" width="300" height="300">

# Techmmunity - Serverless Vercel Ncc

<a href="https://github.com/techmmunity/eslint-config">
	<img src="https://img.shields.io/badge/style%20guide-Techmmunity-01d2ce?style=for-the-badge" alt="Style Guide: Techmmunity">
</a>
<a href="https://www.codefactor.io/repository/github/techmmunity/serverless-vercel-ncc">
	<img src="https://www.codefactor.io/repository/github/techmmunity/serverless-vercel-ncc/badge?style=for-the-badge" alt="CodeFactor">
</a>
<a href="https://coveralls.io/github/techmmunity/serverless-vercel-ncc?branch=master">
	<img src="https://img.shields.io/coveralls/github/techmmunity/serverless-vercel-ncc/master?style=for-the-badge" alt="Coveralls">
</a>
<a href="https://github.com/techmmunity/serverless-vercel-ncc/actions/workflows/coverage.yml">
	<img src="https://img.shields.io/github/workflow/status/techmmunity/serverless-vercel-ncc/Collect%20Coverage?label=tests&logo=github&style=for-the-badge" alt="Tests">
</a>
<a href="https://www.npmjs.com/package/serverless-vercel-ncc">
	<img src="https://img.shields.io/npm/v/serverless-vercel-ncc.svg?color=CC3534&style=for-the-badge" alt="Npm">
</a>
<a href="https://www.npmjs.com/package/serverless-vercel-ncc">
	<img src="https://img.shields.io/npm/dw/serverless-vercel-ncc.svg?style=for-the-badge" alt="Downloads">
</a>

<br>
<br>

</div>

A serverless plugin to work with @vercel/ncc.

## Install

With Yarn:

```sh
yarn add serverless-vercel-ncc
```

With NPM:

```sh
npm i serverless-vercel-ncc
```

## Usage

```yml
# serverless.yml

custom:
  ncc:
    concurrency: 3 # Quantity of files being compiled at the same time
    excludeDependencies: false # Exclude all the dependencies of package.json
    minify: false # @vercel/ncc option
    sourceMap: false # @vercel/ncc option
    sourceMapRegister: true # @vercel/ncc option
    dependenciesToExclude: # Dependencies to exclude (if u want to exclude some extra
      - example-dependency # dependencies, or some dependencies that aren't at
      - example-dependency # package.json)
    # Extra @vercel/ncc options aren't accepted
```

## How to contribute?

All the details about contributing to the project are [described here](https://github.com/techmmunity/base-project-services/blob/master/CONTRIBUTING.md).
