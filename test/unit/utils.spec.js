import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect } = chai
import { sandbox } from 'sinon'
import log from '../../src/utils/log'
import sleep from '../../src/utils/sleep'
import upload from '../../src/utils/upload'
import AWS from 'aws-sdk-mock'
import AWS_SDK from 'aws-sdk'

describe('utls', () => {
    describe('log', () => {
        it('should log', ()=>{
            const logRes = log('log test string')
            expect(logRes).to.equal(undefined)
        })
        it('should log', ()=>{
            const logRes = log('log test string')
            expect(logRes).to.equal(undefined)
        })
    })
    describe('sleep', () => {
        it('should sleep', ()=>{
            return sleep(1).then((response)=>{
                expect(response).to.equal(undefined)
            })
        })
    })
    
    describe('upload', () => {

        const sbox = sandbox.create()
        let putStub

        before(()=>{
          AWS.setSDKInstance(AWS_SDK)
        })
      
        const ETag = '"6805f2cfc46c0f04559748bb039d69ae"'
        const filename = 'filename'
        const bucket = 'test-bucket'
        const data = 'test data'
        const url = 'https://github.com/unitsix'

        beforeEach(()=>{
            putStub = sbox.stub()
            putStub.yields(null,{ ETag })
            AWS.mock('S3', 'putObject', putStub)      
        })

        afterEach(()=>{
            AWS.restore('S3')
            sbox.restore()
        })
          
        it('should return string when uploading png with filename', ()=>{
            return upload({ filename, "filetype": "png", bucket, data, url }).then((response)=>{
                expect(response).to.be.a('Object')
                expect(response.ETag).to.be.a('string')
            })
        })

        it('should return string when uploading png with filename and publicread is true', ()=>{
            return upload({ filename, "filetype": "png", bucket, data, url, "publicread": true }).then((response)=>{
                expect(response).to.be.a('Object')
                expect(response.ETag).to.be.a('string')
            })
        })

        it('should return string when uploading png without filename', ()=>{
            return upload({ "filename": '', "filetype": "png", bucket, data, url }).then((response)=>{
                expect(response).to.be.a('Object')
                expect(response.ETag).to.be.a('string')
            })
        })

        it('should return string when uploading pdf with filename', ()=>{
            return upload({ filename, "filetype": "pdf", bucket, data, url }).then((response)=>{
                expect(response).to.be.a('Object')
                expect(response.ETag).to.be.a('string')
            })
        })
    })
    
})

//TO MOCK ES6 ... FUNCTIONALITY 
if (!Object.entries)
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
}