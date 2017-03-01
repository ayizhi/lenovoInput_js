/**
 * This is a Mock demo for dev
 * @param api: [string] rquest Url
 * @param response: request callback
 */
module.exports = {

    // request url
    api: '/test/hello',

    // return
    response: (req, res) => {
        res.send({
            status: true,
            data: {
                id: 123,
                name: 'Noe'
            }
        })
    }
}

