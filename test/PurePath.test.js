import PurePath from 'lib/PurePath'


describe("PurePath", () => {
    describe("constructor", () => {
        test(
            "accepts a path of type string, and assigns as string", () => {
            const str = "/path/to/file.txt"
            const path = new PurePath(str)
            expect(path.path).toBe(str)
            expect(typeof path.path).toBe("string")
        })

        test(
            "accepts a path of type PurePath, and assigns as string", () => {
            const p = new PurePath("/path/to/file.txt")
            const path = new PurePath(p)
            expect(path.path).toBe(p.path)
            expect(typeof path.path).toBe("string")
        })

        test.each([
            [new Number(1)],
            [new Promise(() => "/path/to/file.txt")],
            [new Date("1900-01-01")]
        ])(
            "throws TypeError if path is not of type string or PurePath",  
            (arg) => {
                expect(() => new PurePath(arg)).toThrow(
                    new TypeError(
                        `Invalid type for argument path. ` +
                        `Expected one of (string, PurePath), got ${arg.constructor.name}`
                    )
                )
            }
        )


    })
})