#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const xml = require('xml');
const glob = require('glob-fs')({ gitignore: false, builtins: false });
const mm = require('micromatch');
const nuget = require('nuget-in-path');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const packlist = require('npm-packlist');

const nuspecPath = path.resolve(process.cwd(), 'package.nuspec');

function getTargetPath(file) {
  return path.dirname(`content/Scripts/${file.replace('dist/', '')}`);
}

packlist({ path: process.cwd() }).then(files => {
  files = files.filter(file => file !== 'package.json').map(
    file =>
      fs.statSync(file).isFile() && {
        file: {
          _attr: {
            src: file,
            sotargeturce: getTargetPath(file),
          },
        },
      }
  );

  // Generate nuspec file
  const nuspec = xml(
    [
      {
        package: [
          {
            _attr: {
              xmlns:
                'http://schemas.microsoft.com/packaging/2011/08/nuspec.xsd',
            },
          },
          {
            metadata: [
              { id: pkg.name },
              { version: pkg.version },
              { description: pkg.description },
              { authors: 'FezVrasta' },
              { projectUrl: pkg.homepage },
            ],
          },
          { files },
        ],
      },
    ],
    { declaration: true, indent: true }
  );

  fs.writeFileSync(nuspecPath, nuspec);

  nuget.pack(nuspecPath, (err, nupkg) => {
    if (err) {
      return console.error(err);
    }
    nuget.push(nupkg, err => {
      fs.unlinkSync(nuspecPath);
      if (err) {
        return console.error(err);
      }
      console.info(`Nuget: Successfully pushed ${nupkg.path}`);
    });
  });
});
