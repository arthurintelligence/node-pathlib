import pathlib, { relative } from "node:path"

/**
 * Pure path objects provide path-handling operations which don’t actually access a filesystem.
 * Leverages a Builder pattern to make the interface more fluid to use.
 * @see https://docs.python.org/3/library/pathlib.html#pure-paths
 * @class
 */
class PurePath {
  /**
   * Creates a PurePath instance.
   * @param {...(string|PurePath)} segments - Path segments (or canonical path) to create a PurePath with
   * @returns {PurePath} - A new instance of PurePath.
   */
  constructor(...segments) {
    const pathSegments = segments.map((segment) => {
      if (!(typeof segment === "string") && !(segment instanceof PurePath)) {
        throw TypeError(
          `Invalid type for argument path. ` +
            `Expected one of (string, PurePath), got ${segment.constructor.name}`,
        )
      }
      return `${segment}`
    })
    const path = pathlib.normalize(pathlib.join(...segments.map((s) => `${s}`)))
    /**
     * The normalized path string.
     * @type {string}
     */
    this.path = path

    /**
     * Array of path parts, as separated by node:path.sep
     * @type {string[] | null}
     * @private
     */
    this._parts = null
  }

  /**
   * Returns the last part of the path. Equivalent of `node:path.basename(string)`
   * @returns {string} - The name of the file or directory.
   */
  get name() {
    return pathlib.basename(this.path)
  }

  /**
   * Returns the parent directory path.
   * @returns {PurePath} - The parent directory path.
   */
  get parent() {
    return new PurePath(pathlib.dirname(this.path))
  }

  /**
   * Returns an array of path parts.
   * @returns {string[]} - Array of path parts.
   */
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

  /**
   * Returns the root of the path.
   * @returns {string} - The root of the path.
   */
  get root() {
    return pathlib.parse(this.path).root
  }

  /**
   * Returns the file stem (name without suffix).
   * @returns {string} - The stem of the file name.
   */
  get stem() {
    const name = this.name
    if (name.includes(".")) {
      let splits = name.split(".")
      if (name.startsWith(".")) {
        return [`.${splits[1]}`, ...splits.slice(2, -1)].join(".")
      } else {
        return splits.slice(0, -1).join(".")
      }
    }
    return name
  }

  /**
   * Returns the file extension of the final component, if any.
   * @returns {string} - The file extension.
   */
  get suffix() {
    const suffixes = this.suffixes
    return suffixes.length ? suffixes[suffixes.length - 1] : ""
  }

  /**
   * Returns an array the path's file extensions.
   * @returns {string[]} - Array of path's file extensions.
   */
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

  /**
   * Returns the path as a file URI.
   * @returns {string} - The file URI.
   */
  asURI() {
    return `file://${this.path.replace(pathlib.sep, "/")}`
  }

  /**
   * Checks if the path is absolute.
   * @returns {boolean} - True if the path is absolute, otherwise false.
   */
  isAbsolute() {
    return pathlib.isAbsolute(this.path)
  }

  /**
   * Joins segments to the PurePath object, creating a new one.
   * Equivalent of `node:path.join`, and python `pathlib.Path.__div__`.
   * @param {...string} segments - segments to join.
   * @returns {PurePath} - A new PurePath instance representing the joined segments.
   */
  join(...segments) {
    return new PurePath(pathlib.join(this.path, ...segments.map((p) => `${p}`)))
  }

  /**
   * Returns the relative path to another path.
   * @param {string|PurePath} other - The other path to which to calculate the relative path.
   * @returns {PurePath} - A new PurePath instance representing the relative path.
   * @throws {Error} - If the current path is not relative to the provided path.
   */
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

  /**
   * Returns a new path with a different name.
   * @param {string} name - The new name for the path.
   * @returns {PurePath} - A new PurePath instance with the specified name.
   * @throws {Error} - If the current path has an empty name.
   */
  withName(name) {
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty name`)
    }
    const parts = this.parts.slice(0, -1)
    return new PurePath(pathlib.join(...parts, name))
  }

  /**
   * Returns a new path with a different stem.
   * @param {string} stem - The new stem for the path.
   * @returns {PurePath} - A new PurePath instance with the specified stem.
   * @throws {Error} - If the current path has an empty stem.
   */
  withStem(stem) {
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty stem`)
    }
    let parts = this.parts
    parts[parts.length - 1] =
      `${stem}${parts[parts.length - 1].substring(this.stem.length)}`
    return new PurePath(parts.join(pathlib.sep))
  }

  /**
   * Returns a new path with a different suffix.
   * @param {string} value - The new suffix for the path.
   * @returns {PurePath} - A new PurePath instance with the specified suffix.
   * @throws {Error} - If the specified suffix is invalid or if the current path has an empty suffix.
   */
  withSuffix(value) {
    if (value !== "" && !/\.[a-zA-Z0-9]+/.test(value)) {
      throw Error(`Invalid suffix '${value}'`)
    }
    if (this.root === this.path) {
      throw Error(`PurePath('${this.root}') has an empty suffix`)
    }
    return new PurePath(
      `${this.path.substring(0, this.path.length - this.suffix.length)}${value}`,
    )
  }

  /**
   * Returns a new path with different suffixes.
   * @param {string[]} suffixes - Array of new suffixes for the path.
   * @returns {PurePath} - A new PurePath instance with the specified suffixes.
   * @throws {TypeError} - If suffixes is not an array of strings.
   * @throws {Error} - If any of the specified suffixes are invalid or if the current path has an empty suffix.
   */
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
      `${this.path.substring(0, this.path.length - this.suffixes.join("").length)}${suffixes.join("")}`,
    )
  }

  /**
   * Returns the path as a string.
   * @returns {string} - The path as a string.
   */
  toString() {
    return this.path
  }
}

export default PurePath
