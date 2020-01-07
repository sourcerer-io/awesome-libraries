(async function() {
  'use strict';

module.exports = [
  "http://junit.cvs.sourceforge.net/junit", // java.junit, junit-team/junit4
  "http://cglib.cvs.sourceforge.net/cglib", // java.cglib, cglib/cglib
  "AlibabaTech/fastjson", // java.fastjson, alibaba/fastjson
  "clojure/clojure", // programming language
  "tokuhirom/Minilla", // perl tool
  "miyagawa/Dist-Milla", // perl tool
  "rjbs/Dist-Zilla", // perl tool
  "sphinx-doc/sphinx", // a python tool
  "pypa/setuptools", // a python tool
  "https://svn.apache.org/repos/asf/xerces/java", // already supported at different repo, see java.xerces
  "checkstyle/checkstyle", // java linting tool
  "ytdl-org/youtube-dl", // python command-line tool
  "pytest-dev/pytest-cov", // plugin for pytest
  "apache/groovy", // programming language
  "jazzband/django-debug-toolbar", // python tool for Django
  "miyagawa/cpanminus", // perl tool
  "yanick/git-cpan-patch", // perl tool
  "purplefox/vert.x", // java project has moved to eclipse-vertx/vert.x
  "perl-carton/carton", // perl dependency manager
  "pjcj/Devel--Cover", // perl coverage metrics tool
  "groovy/groovy-core", // moved to apache/groovy
  "tox-dev/tox", // cli tool
  "pypa/virtualenv", // virtual python environment tool
  "PyCQA/pylint", // python lintin tool,
  "docker/compose", // docker composer tool
  "pmuir/cdi", // spec
  "gugod/App-perlbrew", // perl installation tool
  "babel/babel", // js compiler
  "zzzeek/sqlalchemy", // clone of sqlalchemy/sqlalchemy
  "googleapis/googleapis", // python library, classifiers don't work on protocol buffers, see pull #130
  "squizlabs/PHP_CodeSniffer", // PHP validation tool
  "timbunce/devel-nytprof", // perl profiler
  "jayway/awaitility", // redirects to awaitility/awaitility
  "apache/maven", // project management tool
  "pypa/twine", // python PyPI publishing utility
  "pypa/pipenv", // python dev workflow tool
  "hashicorp/packer", // an image tool written in Go
  "go.uber.org/zap", // dupe of github repo
  "gohugoio/hugo", // CMS written in Go
  "containous/traefik", // edge router in Go
  "pingcap/tidb", // tidb
  "cockroachdb/cockroach", // sql database
  "rancher/k3s", // kubernetes tool
  "cloudson/gitql", // git query tool
  "go-swagger/go-swagger", // swaggger tool
  /^gohugoio\/hugo\/compare/, // not repos
  "https://github.com/v2ray/v2ray-core", // network tools
  "github.com/coreybutler/nvm-windows", // node tool
];

}());
