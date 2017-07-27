# Nuget Publish

This small utility makes it possible to publish npm packages to NuGet directly using
the metadata provided by your existing `package.json`.

## Usage

Add `nuget-publish` to the `devDependencies` of your package:

```
yarn add --dev nuget-publish
```

Now you can use the `nuget-publish` command in your npm scripts to publish your
package to npm. You may add a `postpublish` script to automatize it:

```
"scripts": {
    "postpublish": "nuget-publish"
}
```

### Copyright and license

Code and documentation copyright 2016 **Federico Zivolo**. Code released under the [MIT license](LICENSE.md). Docs released under Creative Commons.
