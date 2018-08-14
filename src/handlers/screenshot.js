import * as log from '@vaya/logdna-formatter'
import screenshot from '../libs/screenshot'
import upload from '../utils/upload'

export default async function handler(event, context, callback) {

    const logHost = {"hostname": "serverless-chrome-screenshot", "logStream": "handler-screenshot", "tags": "lambda, serverless, aws, screenshot"}
    
    try {
        log.debug('{"take_screenshot": "starting"}', logHost)

        const {
            queryStringParameters: {
                url = 'http://github.com/unitsix',
                mobile = false,
                filename = '',
                bucket = '',
                publicread = false,
            },
        } = event

        log.debug(JSON.stringify(event.queryStringParameters), logHost)
        log.debug(`{"Status": "Received URL: ${url}"}`, logHost)
        if (bucket !== '') log.debug(`{"Status": "Received Bucket: ${bucket}"}`, logHost)
        if (filename) log.debug(`{"Status": "Received filename: ${filename}"}`, logHost)
        if (publicread) log.debug(`{"Status": "Received publicread: ${publicread}"}`, logHost)
        if (mobile) log.debug(`{"Status": "Received Mobile setting: ${mobile}"}`, logHost)

        log.debug(`{"Status": "Settings set"}`, logHost)

        let data

        log.debug(`{"Status": "Processing ${url}"}`, logHost)

        const startTime = Date.now()

        data = await screenshot(url, mobile)

        log.debug(`{"Status": "Chromium took ${Date.now() - startTime}ms to load URL and capture screenshot."`, logHost)

        // upload the file if bucket set
        if (bucket !== '') { 
            const details = await upload({ filename, "filetype": "png", bucket, data, url, publicread })
            log.info(JSON.stringify(details), logHost)
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify(details),
            })
        } else {
            return callback(null, {
                statusCode: 200,
                body: data,
                isBase64Encoded: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'image/png',
                },
            })
        }
    } catch (error) {
        log.warn(`{"error": "${error}"}`, logHost)
        return callback(null, error)
    }
}