import log from '../utils/log'
import screenshot from '../chrome/screenshot'

export default async function handler(event, context, callback) {

    log('{"take_screenshot": "starting"}')

    const {
        queryStringParameters: {
            url = 'http://github.com/unitsix',
            mobile = false,
            bucket = '',
        },
    } = event

    log(`{"Status": "Received URL: ${url}"}`)
    if (bucket !== '') log(`{"Status": "Received Bucket: ${bucket}"}`)
    if (mobile) log(`{"Status": "Received Mobile setting: ${mobile}"}`)

    var unixtimestamp = Math.round(new Date().getTime() / 1000);
    const timeout = process.env.PAGE_LOAD_TIMEOUT;

    const crypto = require('crypto');
    const targetHash = crypto.createHash('md5').update(url).digest('hex');
    const targetFilename = `tmp/${targetHash}/${unixtimestamp}.png`;

    log(`{"Status": "Settings set"}`)
    log(`{"Settings":{ "timeout": ${timeout}, "targetHash": "${targetHash}", "targetFilename": "${targetFilename}" }}`)

    let data

    log(`{"Status": "Processing ${url}"}`)

    const startTime = Date.now()

    //try to take screenshot
    try {
        data = await screenshot(url, mobile)
    } catch (error) {
        console.error('Error capturing screenshot for', url, error)
        return callback(error)
    }

    log(`{"Status": "Chromium took ${Date.now() - startTime}ms to load URL and capture screenshot."`)

    // upload the file if bucket set
    if (bucket !== '') {
        const AWS = require('aws-sdk');
        const s3 = new AWS.S3();
        var img = data.replace(/^data:image\/\w+;base64,/, ""),
            buf = new Buffer(img, 'base64');
        s3.putObject({
            ACL: 'public-read',
            Key: targetFilename,
            Body: buf,
            ContentEncoding: 'base64',
            Bucket: bucket,
            ContentType: 'image/png',
        }, (err) => {
            if (err) {
                console.warn(`{"putObject": "${err}"}`)
                var details = {
                    "message": `Please try again ${err}`
                }
            } else {
                log('{"putObject": "success"}')
                var details = {
                    "hash": targetHash,
                    "key": targetFilename,
                    "bucket": bucket
                }
                log('{"details":', details, '}')
            }
        });
    }
    return callback(null, {
        statusCode: 200,
        body: data,
        isBase64Encoded: true,
        headers: {
            'Content-Type': 'image/png',
        },
    })
}