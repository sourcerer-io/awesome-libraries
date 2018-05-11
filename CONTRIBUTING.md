# Contributing

Hi there! We welcome contributions to Libraries to improve Sourcerer and learn more about the engineering world!

## Adding a library

We try only to add libraries once they have some usage. We prefer libraries to be in use in hundreds of repositories before supporting them in Sourcerer.

To add support for a new library:

1. Add a `name` for your library that will be used to show the library in Sourcerer profiles.
1. Add information about library: 
`repo` - github repository with library’s source code. If no open source code for the library is available then keep `repo` empty and add `examples` field with list of github repositories that extensively use the library.
At `names in imports` list all possible imports for the library. If the library is being used without importing, leave the list empty.
`tech` - add technology from [`technologies.json`](technologies.json). 
1. Open a pull request. It will take us a couple of days to update classifiers for your libraries.

## Adding new technology
