const express = require('express')
const multer = require('multer')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser').urlencoded({ extended: false })
const cors = require('cors')
const fs = require('fs')

const app = express()

const PORT = process.env.PORT || 3500
const maindir = path.join(__dirname, "..")
console.log(`main directory is: ${maindir}`)

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        const stdpath = path.join(maindir, "public/files")
        const trgtpath = path.join(stdpath, req.body.location)

        if (!fs.existsSync(trgtpath)) {
            const folders = req.body.location.split('/')
            let curpath = stdpath
            for (let i = 0; i < folders.length; i++) {
                const nxtpath = path.join(curpath, folders[i])
                if (!fs.existsSync(nxtpath)) fs.mkdirSync(nxtpath)
                curpath = nxtpath
            }
        }

        cb(null, trgtpath)
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: fileStorageEngine })
app.use(morgan('dev'))
app.use(bodyParser)
app.use(cors())

app.post('/single', upload.single('example-file'), (req, res) => {
    res.json({
        message: 'success',
        file: req.file,
        body: req.body
    })
})



app.listen(PORT, () => console.log(`Listening on port ${PORT}.....`))