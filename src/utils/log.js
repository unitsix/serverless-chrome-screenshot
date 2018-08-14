import * as logdna from '@vaya/logdna-formatter'

export default function log(...stuffToLog) {
    logdna.debug(`{"details" : "${JSON.stringify(...stuffToLog)}"}`, {"hostname": "serverless-chrome-screenshot", "logStream": "libs", "tags": "lambda, serverless, aws, screenshot"})
}
