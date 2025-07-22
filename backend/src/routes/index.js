const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const APIs = fs.readdirSync(path.join(__dirname))

router.use(express.json({limit: "50mb", extended: false}))
router.use(express.urlencoded({limit: "50mb", extended: false}))
router.use(cors())

APIs.forEach(file => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const route = require(path.join(__dirname, file))
        const fileName = file.split('.')[0]
        router.use(`/${fileName}`, route)
    }
})

module.exports = router