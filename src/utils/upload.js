
import crypto from 'crypto'
const AWS = require('aws-sdk');

export default async function upload({ filename, filetype, bucket, data, url, publicread }) {
    
    let targetFilename
    let buf
    let ContentType

    if (filename == ''){
        const unixtimestamp = Math.round(new Date().getTime() / 1000)
        const targetHash = crypto.createHash('md5').update(url).digest('hex')
        targetFilename = `${targetHash}/${unixtimestamp}.${filetype}`
    } else 
        targetFilename = `${filename}.${filetype}`

    if (filetype == 'png'){
        const img = data.replace(/^data:image\/\w+;base64,/, "")
        buf = new Buffer(img, 'base64')
        ContentType = 'image/png'
    } else {
        buf = new Buffer(data, 'base64')
        ContentType = 'application/pdf'
    }

    const client = s3Client()

    const dataObj = {
        Key: targetFilename,
        Body: buf,
        ContentEncoding: 'base64',
        Bucket: bucket,
        ContentType: ContentType,
    }

    if (publicread) dataObj['ACL'] = 'public-read'

    return client.putObject(dataObj).promise().then((data)=>data)
        
}

const s3Client = () => {
    const client = new AWS.S3({ apiVersion: '2006-03-01' })
    return client
}