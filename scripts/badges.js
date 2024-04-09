import fs from "node:fs"
import path from "node:path"
import * as url from "node:url"
import { makeBadge } from "badge-maker"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const __rootdirname = path.dirname(__dirname)
const __packageJsonPath = path.join(__rootdirname, "package.json")

const ensureDirSync = (dirname) => {
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, {
      recursive: true,
    })
  }
}

function main() {
  const badgeKeys = process.argv[2].split(",")
  for (let badgeKey of badgeKeys) {
    makeAndExportBadge(badgeKey)
  }
}

function makeAndExportBadge(badgeKey) {
  switch (badgeKey) {
    case "engine/node": {
      const packageJson = JSON.parse(fs.readFileSync(__packageJsonPath))
      const badge = makeBadge({
        label: "node",
        message: packageJson.engines.node,
        color: "informational",
        style: "flat",
      })
      ensureDirSync(path.join(__rootdirname, "docs/badges"))
      fs.writeFileSync(
        path.join(__rootdirname, "docs/badges/node-version.svg"),
        badge,
      )
      break
    }
    case "semver": {
      const packageJson = JSON.parse(fs.readFileSync(__packageJsonPath))
      const badge = makeBadge({
        label: "SemVer",
        message: packageJson.version,
        color: "informational",
        style: "flat",
      })
      ensureDirSync(path.join(__rootdirname, "docs/badges"))
      fs.writeFileSync(
        path.join(__rootdirname, "docs/badges/semver.svg"),
        badge,
      )
      break
    }
    default: {
      throw new Error("Unsupported badge name")
    }
  }
}

main()
