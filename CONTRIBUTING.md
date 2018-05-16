# Contributing

Hi there! We welcome contributions to Libraries to improve Sourcerer and help it learn more about the engineering world.

## Adding a library

We try only to add libraries once they have some usage. We prefer libraries to be in use in hundreds of repositories before supporting them in Sourcerer.

To add support for a new library:

Look at `language.json` files in this repository for your favorite languages. See if your favorite library is listed there. If not, add it to the list. For each library you will need to provide the following information:

* Library `name`: as used to commonly refer to a library, e.g. Tensorflow
* Library technology group (`tech`): look at [technologies.json](technologies.json) for existing categories ("iot", "faster-code", etc). If none is fitting feel free to add yours. Technology groups are used to group libraries together on profiles.
* A compact and descriptive `tag` for a library: see [technologies.json](technologies.json) again for examples of tags. Tags are more or less free form, and are used next to library name in Sourcerer to give reader an idea of what the library is about.
* Library repository URL (`repo`): If it's GitHub, you can just use a relative path.
* Library `imports`: a common prefix for files you import when using a library. If the library is used without imports, leave the list empty.
* A path to `examples` of library use (optional): This is optional, but if present it will make it much faster for library to appear in Sourcerer. We use examples to train our classifiers for library detection.

Open a pull request. It will take us a couple of days to update classifiers for your libraries.

Every library you list will make the product better for the entire community. Thank you for doing this!
