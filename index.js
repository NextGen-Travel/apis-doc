const express = require('express')

const app = express()

app.use(express.static('.'))

app.listen('9999', () => {
    console.log('done')
})
