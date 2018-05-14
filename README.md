# Libraries

Libraries that are being shown in Sourcerer profiles.

[issues]: https://github.com/sourcerer-io/libraries/issues
[new-issue]: https://github.com/sourcerer-io/libraries/issues/new

See [Troubleshooting](#troubleshooting) and [`CONTRIBUTING.md`](CONTRIBUTING.md) before filing an issue or creating a pull request.

## How Sourcerer works

Sourcerer takes a list of libraries it knows from `language`.json and tries to determine the library used by each line of code.
The result is used to produce library statistics in Tech section and the technology with the largest number of code lines in Repository facts section.


## Troubleshooting

### My profile isn't showing my libraries

If Sourcerer doesn't know about library you work with, consider [contributing](CONTRIBUTING.md) to Libraries by opening a pull request to add support for your library.

### My profile shows libraries I don't work with

Sourcerer relies on statistical classifier to predict library for a code line, so mistakes are possible. Search for [open issues][issues] to see if anyone else has already reported the issue. Any information you can add, especially links to public repositories, is helpful.

### My repository has label of wrong technology

It could be for a few reasons:

1. Sourcerer doesn't know about the library that is central for your repository.
1. The number of code lines using the expected library is less than for the library that is actually shown.

If Sourcerer doesn't know about the library, consider [contributing](CONTRIBUTING.md) to Libraries by opening a pull request to add support for your library.


## Contributing

Please check out our [contributing guidelines](CONTRIBUTING.md).
