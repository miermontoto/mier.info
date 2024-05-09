const fs = require("fs");
const path = require("path");

// esto puede ser el código más feo que haya escrito en mi vida

function findAsset(dir, filename) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
        const filepath = path.join(dir, file)

        if (fs.statSync(filepath).isDirectory()) {
            let result = findAsset(filepath, filename)
            if (result) return result
        } else if (path.basename(filepath) === filename) {
            return filepath
        }
    }

    return null
}


const addAsset = (type, filename) => {
    return type === "script" ? addScript(filename) : addStyle(filename)
}


const addStyle = (filename) => {
	let filepath = findAsset(path.resolve(__dirname, '../static/css'), `${filename}.sass`)

	if (!filepath) {
		console.error(`style file ${filename}.sass not found`)
		return ''
	}

	return `<link rel="stylesheet" href="/${filepath.split('src/')[1].replace('.sass', '.css')}">`
}


const addScript = (filename) => {
	let filepath = findAsset(path.resolve(__dirname, '../static/js'), `${filename}.js`)

	if (!filepath) {
		console.error(`script file ${filename}.js not found`)
		return ''
	}

	return `<script type="module" src="/${filepath.split('src/')[1]}"></script>`
}

module.exports = addAsset
