import PurePath from "lib/PurePath"

describe("PurePath", () => {
  describe("constructor", () => {
    test("accepts a path of type string, and assigns as string", () => {
      const str = "/path/to/file.txt"
      const path = new PurePath(str)
      expect(path.path).toBe(str)
      expect(typeof path.path).toBe("string")
    })

    test("accepts a path of type PurePath, and assigns as string", () => {
      const p = new PurePath("/path/to/file.txt")
      const path = new PurePath(p)
      expect(path.path).toBe(p.path)
      expect(typeof path.path).toBe("string")
    })

    test("accepts multiple path segments as argument, and assigns as string", () => {
      const arg = ["/path/", "to/file.txt"]
      const path = new PurePath(...arg)
      expect(path.path).toBe("/path/to/file.txt")
      expect(typeof path.path).toBe("string")
    })

    test.each([
      ["Number", new Number(1)],
      ["Promise", new Promise(() => "/path/to/file.txt")],
      ["Date", new Date("1900-01-01")],
    ])(
      "throws TypeError if path is not of type string or PurePath: %s",
      (casename, value) => {
        expect(() => new PurePath(value)).toThrow(
          new TypeError(
            `Invalid type for argument path. ` +
              `Expected one of (string, PurePath), got ${value.constructor.name}`
          )
        )
      }
    )
  })

  describe("getter name", () => {
    test.each([
      ["File, single ext", "/path/to/file.txt", "file.txt"],
      ["File, multiple ext", "/path/to/file.tar.gz", "file.tar.gz"],
      ["Directory", "/path/to/dir", "dir"],
    ])(
      "returns last path part, as defined by path.sep: %s",
      (casename, value, expected) => {
        const path = new PurePath(value)
        expect(path.name).toBe(expected)
      }
    )
  })

  describe("getter parent", () => {
    test("returns PurePath", () => {
      const path = new PurePath("/path/to/file.txt")
      expect(path.parent).toBeInstanceOf(PurePath)
    })

    test.each([
      ["File", "/path/to/file.txt", "/path/to"],
      ["Directory", "/path/to/dir", "/path/to"],
      ["Root", "/", "/"],
    ])("returns parent dir: %s", (casename, value, expected) => {
      const path = new PurePath(value)
      expect(path.parent.path).toBe(expected)
    })
  })

  describe("getter parts", () => {
    test("returns Array<String>", () => {
      const path = new PurePath("/path/to/file.txt")
      const asserted = path.parts
      expect(asserted).toBeInstanceOf(Array)
      for (const part of asserted) {
        expect(typeof part).toBe("string")
      }
    })

    test.each([
      ["File", "/path/to/file.txt", ["/", "path", "to", "file.txt"]],
      ["Directory", "/path/to/dir", ["/", "path", "to", "dir"]],
      ["Root", "/", ["/"]],
    ])(
      "returns path parts array, as defined by path.sep: dir: %s",
      (casename, value, expected) => {
        const path = new PurePath(value)
        const asserted = path.parts
        try {
          for (
            let i = 0;
            i <= Math.max(asserted.length, expected.length);
            i += 1
          ) {
            expect([i, asserted[i]]).toStrictEqual([i, expected[i]])
          }
        } catch (e) {
          console.log({ casename, value, asserted, expected })
          throw e
        }
      }
    )
  })

  describe("getter stem", () => {
    test.each([
      ["File with single extension", "/path/to/file.txt", "file"],
      ["File with multiple extensions", "/path/to/file.tar.gz", "file.tar"],
      ["File starting with dot, without extension", "/path/to/.file", ".file"],
      [
        "File starting with dot, with single extension",
        "/path/to/.file.txt",
        ".file",
      ],
      [
        "File starting with dot, with multiple extensions",
        "/path/to/.file.tar.gz",
        ".file.tar",
      ],
      ["Directory", "/path/to/dir", "dir"],
      ["Root", "/", ""],
    ])("returns stem: %s", (casename, value, expected) => {
      const path = new PurePath(value)
      const asserted = path.stem
      try {
        expect(asserted).toBe(expected)
      } catch (e) {
        console.log({ casename, value, asserted, expected, name: path.name })
        throw e
      }
    })
  })

  describe("getter suffix", () => {
    test.each([
      ["File with single extension", "/path/to/file.txt", ".txt"],
      ["File with multiple extensions", "/path/to/file.tar.gz", ".gz"],
      ["File starting with dot, no extension", "/path/to/.file", ""],
      [
        "File starting with dot, single extension",
        "/path/to/.file.txt",
        ".txt",
      ],
      [
        "File starting with dot, multiple extension",
        "/path/to/.file.tar.gz",
        ".gz",
      ],
      ["Directory", "/path/to/dir", ""],
      ["Root", "/", ""],
    ])("returns stem: %s", (casename, value, expected) => {
      const path = new PurePath(value)
      const asserted = path.suffix
      try {
        expect(asserted).toBe(expected)
      } catch (e) {
        console.log({ casename, value, asserted, expected })
        throw e
      }
    })
  })

  describe("getter suffixes", () => {
    test.each([
      ["File with single extension", "/path/to/file.txt", [".txt"]],
      [
        "File with multiple extensions",
        "/path/to/file.tar.gz",
        [".tar", ".gz"],
      ],
      ["File starting with dot, no extension", "/path/to/.file", []],
      [
        "File starting with dot, single extension",
        "/path/to/.file.txt",
        [".txt"],
      ],
      [
        "File starting with dot, multiple extension",
        "/path/to/.file.tar.gz",
        [".tar", ".gz"],
      ],
      ["Directory", "/path/to/dir", []],
      ["Root", "/", []],
    ])("returns stem: %s", (casename, value, expected) => {
      const path = new PurePath(value)
      const asserted = path.suffixes
      try {
        expect(asserted).toStrictEqual(expected)
      } catch (e) {
        console.log({ casename, value, asserted, expected })
        throw e
      }
    })
  })

  describe("asURI", () => {
    test("returns path prepended with `file://`", () => {
      const str = "/path/to/file.txt"
      const path = new PurePath(str)
      expect(path.asURI()).toBe("file:///path/to/file.txt")
    })
  })

  describe("isAbsolute", () => {
    test.each([
      ["Absolute file", "/path/to/file.txt", true],
      ["Relative file (1)", "./path/to/file.txt", false],
      ["Relative file (2)", "../path/to/file.txt", false],
    ])(
      "returns whether or not path is absolute: %s",
      (casename, value, expected) => {
        const path = new PurePath(value)
        const asserted = path.isAbsolute()
        try {
          expect(asserted).toStrictEqual(expected)
        } catch (e) {
          console.log({ casename, value, asserted, expected })
          throw e
        }
      }
    )
  })

  describe("join", () => {
    test("joins single path correctly", () => {
      const basePath = new PurePath("/path/to")
      const path = basePath.join("file.txt")
      expect(path.toString()).toBe("/path/to/file.txt")
    })

    test("joins multiple paths correctly", () => {
      const basePath = new PurePath("/path/to")
      const path = basePath.join("dir", "file.txt")
      expect(path.toString()).toBe("/path/to/dir/file.txt")
    })

    test("supports PurePath as arguments", () => {
      const basePath = new PurePath("/path/to")
      const path = basePath.join(new PurePath("dir"))
      expect(path.toString()).toBe("/path/to/dir")
    })
  })

  describe("relativeTo", () => {
    test.each([
      ["Parent path", ["/usr/local/etc", "/usr"], "local/etc"],
      [
        "Uncle path",
        ["/usr/local/bin", "/usr/bin/"],
        new Error("'/usr/local/bin' does not start with '/usr/bin/'"),
      ],
      [
        "Sibling path",
        ["/usr/local/bin", "/usr/local/etc"],
        new Error("'/usr/local/bin' does not start with '/usr/local/etc'"),
      ],
    ])("returns relative path: %s", (casename, [self, other], expected) => {
      const pathSelf = new PurePath(self)
      const pathOther = new PurePath(other)
      try {
        const asserted = pathSelf.relativeTo(pathOther).toString()
        expect(asserted).toStrictEqual(expected)
      } catch (e) {
        expect(e).toStrictEqual(expected)
      }
    })
  })

  describe("withName", () => {
    test.each([
      ["File", ["/path/to/file.txt", "file.md"], "/path/to/file.md"],
      ["Directory", ["/path/to/dir", "directory"], "/path/to/directory"],
      ["Root", ["/", "name"], new Error(`PurePath('/') has an empty name`)],
    ])(
      "returns a new instance with proper name: %s",
      (casename, [path, name], expected) => {
        const pathObj = new PurePath(path)
        try {
          const asserted = pathObj.withName(name).toString()
          expect(asserted).toStrictEqual(expected)
        } catch (e) {
          expect(e).toStrictEqual(expected)
        }
      }
    )
  })

  describe("withSuffix", () => {
    test.each([
      ["Not starting with .", "md"],
      ["Invalid characters", ".&/"],
    ])("rejects invalid suffix: %s", (casename, suffix) => {
      const path = new PurePath("/path/to/file.txt")
      expect(() => path.withSuffix(suffix)).toThrow(
        new Error(`Invalid suffix '${suffix}'`)
      )
    })

    test.each([
      [
        "File with single extension",
        ["/path/to/file.txt", ".md"],
        "/path/to/file.md",
      ],
      [
        "File with multiple extensions",
        ["/path/to/file.tar.gz", ".zip"],
        "/path/to/file.tar.zip",
      ],
      [
        "File starting with dot, no extension",
        ["/path/to/.file", ".zip"],
        "/path/to/.file.zip",
      ],
      [
        "File starting with dot, single extension",
        ["/path/to/.file.txt", ".zip"],
        "/path/to/.file.zip",
      ],
      [
        "File starting with dot, multiple extensions",
        ["/path/to/.file.tar.gz", ".zip"],
        "/path/to/.file.tar.zip",
      ],
      ["Directory", ["/path/to/file", ".zip"], "/path/to/file.zip"],
      ["Root", ["/", ".txt"], new Error(`PurePath('/') has an empty suffix`)],
    ])(
      "returns a new instance with proper name: %s",
      (casename, [path, suffix], expected) => {
        const pathObj = new PurePath(path)
        try {
          const asserted = pathObj.withSuffix(suffix).toString()
          expect(asserted).toStrictEqual(expected)
        } catch (e) {
          expect(e).toStrictEqual(expected)
        }
      }
    )
  })

  describe("withSuffixes", () => {
    test.each([
      [
        "Not an array",
        ".tar.gz",
        new TypeError("suffixes should be an Array<String>"),
      ],
      [
        "Not starting with .",
        ["md"],
        new Error(`Invalid suffix 'md' at pos 0`),
      ],
      [
        "Invalid characters",
        [".&/"],
        new Error(`Invalid suffix '.&/' at pos 0`),
      ],
    ])("rejects invalid suffix: %s", (casename, suffixes, expected) => {
      const path = new PurePath("/path/to/file.txt")
      expect(() => path.withSuffixes(suffixes)).toThrow(expected)
    })

    test.each([
      [
        "File with single extension, single suffixes",
        ["/path/to/file.txt", [".j2"]],
        "/path/to/file.j2",
      ],
      [
        "File with single extension, multiple suffixes",
        ["/path/to/file.sql", [".sql", ".j2"]],
        "/path/to/file.sql.j2",
      ],
      [
        "File with multiple extensions, single suffixes",
        ["/path/to/file.tar.gz", [".zip"]],
        "/path/to/file.zip",
      ],
      [
        "File with multiple extensions, multiple suffixes",
        ["/path/to/file.txt.tar.gz", [".md", ".zip"]],
        "/path/to/file.md.zip",
      ],
      [
        "File starting with dot, no extension",
        ["/path/to/.file", [".zip"]],
        "/path/to/.file.zip",
      ],
      [
        "File starting with dot, single extension",
        ["/path/to/.file.txt", [".zip"]],
        "/path/to/.file.zip",
      ],
      [
        "File starting with dot, multiple extensions",
        ["/path/to/.file.tar.gz", [".zip"]],
        "/path/to/.file.zip",
      ],
      ["Directory", ["/path/to/file", [".zip"]], "/path/to/file.zip"],
      ["Root", ["/", [".txt"]], new Error(`PurePath('/') has an empty suffix`)],
    ])(
      "returns a new instance with proper name: %s",
      (casename, [path, suffixes], expected) => {
        const pathObj = new PurePath(path)
        try {
          const asserted = pathObj.withSuffixes(suffixes).toString()
          expect(asserted).toStrictEqual(expected)
        } catch (e) {
          expect(e).toStrictEqual(expected)
        }
      }
    )
  })

  describe("toString", () => {
    test("returns this.path", () => {
      const path = "/path/to/file.txt"
      const pathObj = new PurePath(path)
      expect(pathObj.toString()).toBe(path)
      expect(pathObj.toString()).toBe(pathObj.path)
    })
  })
})
