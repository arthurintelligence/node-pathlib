import * as index from "lib/index"
import PurePath from "lib/PurePath"

describe("exports", () => {
  test("exports PurePath wrapped as a function", () => {
    expect(index.PurePath("/path/to/file.txt")).toBeInstanceOf(PurePath)
    expect(index.default).toBe(undefined)
  })
})
