import * as index from "lib/index"
import PurePath from "lib/PurePath"

describe("exports", () => {
  test("exports PurePath as a named export", () => {
    expect(PurePath).toBe(index.PurePath)
    expect(index.default).toBe(undefined)
  })
})
