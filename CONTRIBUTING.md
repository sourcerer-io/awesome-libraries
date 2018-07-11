# Contributing

Hi there! We welcome contributions to Libraries to improve Sourcerer and help it learn more about the engineering world.

## Adding a library

We try only to add libraries once they have some usage. We prefer libraries to be in use in hundreds of repositories before supporting them in Sourcerer.

To add support for a new library:

Check out `libs` directory of this repository to find out whether your favorite language is supported. The folder contains `json` files, one for each language, for exmaple, `cpp.json` defines libraries for C++. If the folder doesn't contain a file for your language, then please add one. Then, for each library you will need to provide the following information:

* Library `name`: as used to commonly refer to a library, e.g. "TensorFlow" or "Laravel Lumen".
* Library `id`: this should be a unique ID prefixed with a language code, and generally repeating the library name, e.g. "cpp.tensor-flow" or "php.laravel-lumen".
* Library technology group (`tech`): look at [technologies.json](technologies.json) for existing categories ("iot", "faster-code", etc). If none is fitting feel free to add yours. Technology groups are used to group libraries together on profiles.
* A compact and descriptive `tag` for a library: see [technologies.json](technologies.json) again for examples of tags. Tags are more or less free form, and are used next to library name in Sourcerer to give reader an idea of what the library is about.
* Library repository URL (`repo`): If it's GitHub, you can just use a relative path. If no open source code for the library is available then keep `repo` empty and add `examples` field with list of github repositories that extensively use the library.
* Library `imports`: a list of common prefixes for files you import when using a library. If the library is used without imports, leave the list empty. For example, when importing OpenCV in python, you can use `import cv2` or `import cv`, so you would list `["cv2", "cv"]` in imports.
* A path to `examples` of library use (optional): This is optional, but if present it will make it much faster for library to appear in Sourcerer. We use examples to train our classifiers for library detection.

Open a pull request. Note, it will take us a couple of days after the pull requrest is merged to update classifiers for your libraries.

Every library you list will make the product better for the entire community. Thank you for doing this!
