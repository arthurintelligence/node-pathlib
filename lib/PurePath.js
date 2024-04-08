import pathlib, { relative } from "node:path"

class PurePath {
  constructor(path) {
    if (typeof path === "string") {
      this.path = pathlib.normalize(path)
    } else if (path instanceof PurePath) {
      this.path = pathlib.normalize(path.path)
    } else {
      throw TypeError(
        `Invalid type for argument path. ` +
          `Expected one of (string, PurePath), got ${path.constructor.name}`
      )
    }
    this._parts = null
  }

  get name() {
    return pathlib.basename(this.path)
  }

  get parent() {
    return new PurePath(pathlib.dirname(this.path))
  }

  get parts() {
    if (this._parts) {
      return this._parts
    }
    const root = this.root
    if (root === this.path) {
      this._parts = [root]
    } else {
      this._parts = [root, ...this.path.split(pathlib.sep).slice(1)]
    }
    return this._parts
  }

  get root() {
    return pathlib.parse(this.path).root
  }

  get stem() {
    const name = this.name
    if (name.includes(".")) {
      return name.split(".").slice(0, -1).join(".")
    }
    return name
  }

  get suffix() {
    const suffixes = this.suffixes
    return suffixes.length ? suffixes[suffixes.length - 1] : ""
  }

  get suffixes() {
    const parts = this.parts
    const last = parts[parts.length - 1].startsWith(".")
      ? parts[parts.length - 1].substring(1)
      : parts[parts.length - 1]

    if (!last.includes(".")) {
      return []
    }
    return last
      .split(".")
      .slice(1)
      .map((s) => `.${s}`)
  }

  asURI() {
    return `file://${this.path.replace(pathlib.sep, "/")}`
  }

  isAbsolute() {
    return pathlib.isAbsolute(this.path)
  }

  join(...paths) {
    return new PurePath(pathlib.join(this.path, ...paths.map((p) => `${p}`)))
  }

  relativeTo(other) {
    if (!`${this}`.startsWith(`${other}`)) {
      throw Error(`'${this}' does not start with '${other}'`)
    }
    let relativePath = this.path.substring(`${other}`.length)
    if (relativePath.startsWith(pathlib.sep) && relativePath !== pathlib.sep) {
      relativePath = relativePath.substring(1)
    }
    return new PurePath(relativePath)
  }

  withName(value) {
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty name`)
    }
    const parts = this.parts.slice(0, -1)
    return new PurePath(pathlib.join(...parts, value))
  }

  withStem(value) {
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty stem`)
    }
    let parts = this.parts
    parts[parts.length - 1] =
      `${value}${parts[parts.length - 1].substring(this.stem.length)}`
    return new PurePath(parts.join(path.sep))
  }

  withSuffix(value) {
    if (value !== "" && !/\.[a-zA-Z0-9]+/.test(value)) {
      throw Error(`Invalid suffix '${value}'`)
    }
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty suffix`)
    }
    return new PurePath(
      `${this.path.substring(0, this.path.length - this.suffix.length)}${value}`
    )
  }

  withSuffixes(suffixes) {
    if (!Array.isArray(suffixes)) {
      throw TypeError("suffixes should be an Array<String>")
    }
    for (let [i, value] of suffixes.entries()) {
      if (value !== "" && !/\.[a-zA-Z0-9]+/.test(value))
        throw Error(`Invalid suffix '${value}' at pos ${i}`)
    }
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty suffix`)
    }
    return new PurePath(
      `${this.path.substring(0, this.path.length - this.suffixes.join("").length)}${suffixes.join("")}`
    )
  }

  toString() {
    return this.path
  }
}

export default PurePath
