# Sourcerer libraries

Sourcerer is looking to understand engineer's work from source code, and connect engineers via expertise. An important part of our effort is analysis of library use. This repository maintains list of libraries that Sourcerer recognizes. If you have a minute, please make a PR that adds your favorite libraries. Our community will appreciate it.

## How Sourcerer works

Sourcerer analyses commits in a variety of ways. It detects programming languages, uses various heuristics to discover interesting facts about an engineer, looks into team work, and so on. What Sourcerer finds can be easily seen in a Sourcerer profile, for example https://sourcerer.io/adnanrahic or https://sourcerer.io/sergey . A big part of what Sourcerer does is library analysis. For every line of code that Sourcerer looks at, it runs a machine learning algorithm that detects if this line uses any particular library. It allows to present library stats, but it also tells Sourcerer a lot about the purpose of the code. For instance, if it sees you you use node.js a lot, you probably do web developemnt work. Similarly, tensorflow use points to neural networks, etc.

There are a lot of libraries out there, and it's nearly impossible for our group to discover and list them all. So we welcome community [contributions](CONTRIBUTING.md). Adding a library to our list only takes a few minutes, but it improves Sourcerer for everybody, makes profiles reacher, and magnifies Sourcerer ability to correctly interpret code.

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
