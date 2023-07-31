const AuthRouter = require("./authentication/routes");
const fs = require('fs');
const ModulesRouter = require("./modules/routes");
const { isAuthenticated } = require("./authentication/authentication");

const ApiRouter = require("express").Router();

ApiRouter.use('/', async (req, res, next) => {
    // console.log(`url: ${req.url}, method: ${req.method}, body: ${req.body}, \n pid: ${process.pid}`);
    let authenticated = await isAuthenticated(req);
    //console.log(Boolean(authenticated) ? authenticated.id : false);
    //console.log(authenticated);
    req.user = authenticated;
    return next()
})


let getUrls = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./tmp/ports.txt", 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            // console.log('File content:', data);
            data = data.toString();
            //console.log(data);
            //data = data + process.env.API_URLS ? `,${process.env.API_URLS}` : '';
            //  console.log(data, process.env.API_URLS ? `,${process.env.API_URLS}` : '', data + process.env.API_URLS ? `,${process.env.API_URLS}` : '');
            data = data.split(',');
            //   console.log(data);
            let out = [];
            for (let index = 1; index < data.length; index++) {
                if (!isNaN(data[index])) {
                    out.push(`http://localhost:${data[index]}/api`)
                } else {
                    out.push(data[index])
                }
            };
            //console.log(out);
            resolve(out)
        });
    });
}

ApiRouter.get('/getUrls456', async (req, res) => {
    let urls = await getUrls();
    // console.log(ports);
    console.log(urls);
    return res.status(200).send({ urls: urls })
});


ApiRouter.use('/auth', AuthRouter);
ApiRouter.use('/mod', ModulesRouter);

module.exports = ApiRouter;