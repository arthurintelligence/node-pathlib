import pathlib from 'node:path'

class PurePath {
  constructor(path) {
    if(typeof path === "string") {
      this.path = path
    }
    else if (path instanceof PurePath) {
      this.path = path.path
    }
    else {
      throw TypeError(
        `Invalid type for argument path. ` +
        `Expected one of (string, PurePath), got ${path.constructor.name}`
      )
    }
  }
  
  get name() {
    return path.basename(this.path);
  }

  get parent() {
    return new PurePath(pathlib.dirname(this.path));
  }

  get parts() {
    return this.path.split(pathlib.sep).slice(1)
  }

  get root() {
    return pathlib.parse(this.path).root
  }

  get stem() {
    return pathlib.parse(this.path).name
  }

  get suffix() {
    const suffixes = this.suffixes 
    return suffixes[suffixes.length - 1]
  }

  get suffixes() {
    const parts = this.parts
    return parts[parts.length - 1].split('.').slice(1).map(s => `.${s}`)
  }

  asURI() {
    return `file://${this.path.replace(pathlib.sep, '/')}`
  }

  isAbsolute() {
    return pathlib.isAbsolute(this.path)
  }

  isRelativeTo(other) {
    const relativePath = this.relativeTo(other)
    return !relativePath.startsWith('..') && !pathlib.isAbsolute(relativePath);
  }

  join(...paths) {
    return new PurePath(pathlib.join(this.path, ...paths.map(p => `${p}`)));
  }

  normalize() {
    return new PurePath(pathlib.normalize(this.path));
  }

  relativeTo(other) {
    return new PurePath(pathlib.relative(this.path, `${other}`));
  }

  resolve(...paths) {
    return new PurePath(pathlib.resolve(this.path, ...paths));
  }

  withName() {
    const parts = this.parts.slice(0, -1)
    return new PurePath(path.join(...parts, value))
  }

  withStem() {
    let parts = this.parts
    parts[parts.length - 1] = `${value}${parts[parts.length - 1].substr(this.stem.length)}`
    return new PurePath(parts.join(path.sep))
  }

  withSuffix() {
    if(!/\.\w+/.test(value))
      throw Error(`Suffix values should match /\\.\\w+/`)
    return Path(`${this.path.substr(0, this.path.length - this.suffix.length)}${value}`)
  }

  toString() {
    return this.path;
  }
}

export default PurePath