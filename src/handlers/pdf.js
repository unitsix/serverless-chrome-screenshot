import * as log from '@vaya/logdna-formatter'
import pdf, { makePrintOptions } from '../libs/pdf'
import upload from '../utils/upload'

export default async function handler (event, context, callback) {

  const logHost = {"hostname": "serverless-chrome-screenshot", "logStream": "handler-pdf", "tags": "lambda, serverless, aws, screenshot"}
  
  log.debug('{"take_screenshot_pdf": "starting"}', logHost)
  console.log(event)
  const queryStringParameters = event.queryStringParameters || {}
  
  try {
    const {
      url = 'http://github.com/unitsix',
      bucket = '',
      filename = '',
      publicread = false,
      ...printParameters
    } = queryStringParameters
    const printOptions = makePrintOptions(printParameters)
    let data

    log.debug(`{"Status": "Received URL: ${url}"}`, logHost)
    if (bucket !== '') log.debug(`{"Status": "Received Bucket: ${bucket}"}`, logHost)
    log.debug(`{"PDFification": "${url}"}`, logHost)

    const startTime = Date.now()

    data = await pdf(url, printOptions)

    log.debug(`{"details": "Chromium took ${Date.now() - startTime}ms to load URL and render PDF"}`, logHost)

    if (bucket !== '') {
      const details = await upload({ filename, "filetype": "pdf", bucket, data, url, publicread })
      log.info(JSON.stringify(details), logHost)
      return callback(null, {
          statusCode: 200,
          body: JSON.stringify(details)
      })
    } else {
      return callback(null, {
        statusCode: 200,
        body: data,
        isBase64Encoded: true,
        headers: {
          'Content-Type': 'application/pdf',
        },
      })
    }

  } catch (error) {
    log.warn(`{"error": "${error}"}`, logHost)
    return callback(null, error)
  }
}
