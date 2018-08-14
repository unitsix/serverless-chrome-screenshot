import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect } = chai
import promisify from 'promisify-node'
import { sandbox } from 'sinon'
import pdf from '../../src/handlers/pdf'
import screenshot from '../../src/handlers/screenshot'
import * as pdfLib from '../../src/libs/pdf'
import * as screenshotLib from '../../src/libs/screenshot'
import * as uploadUtil from '../../src/utils/upload'
import * as log from '@vaya/logdna-formatter'
import context from '../contexts/mock.lambda.context'

const url = 'https://github.com/unitsix'
const bucket = 'test'
const filename = 'test'

//PDF TESTS
describe('pdf', () => {

  describe('happy path', ()=>{

    let sbox = null

    beforeEach(()=>{
      sbox = sandbox.create() 
      let scLib = sbox.stub(pdfLib, 'default')
      scLib.resolves('string of text')
      let upLib = sbox.stub(uploadUtil, 'default')
      upLib.resolves({"ETag":"\"f8127c63d717f974cb88e4a56c203c48\""})
      let logDebug = sbox.stub(log, 'debug')
      logDebug.resolves('')
      
    })

    afterEach(()=>{
      sbox.restore()
    })

    it('should return base64 encoded application/pdf', ()=>{
      const queryStringParameters = { url }
      const wrappedHandler = function( event, callback) {
        pdf( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters }).then((response)=>{
        expect(response).to.be.a('Object')
        expect(response.body).to.be.a('string')
        expect(response.headers).to.be.a('Object')
        expect(response.headers['Content-Type']).to.equal('application/pdf')
      })
    })

    it('should return base64 encoded application/pdf with bucket defined', ()=>{
      const queryStringParameters = { url, bucket }
      const wrappedHandler = function( event, callback) {
        pdf( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters, "bucket": "test" }).then((response)=>{
        expect(response).to.be.a('Object')
      })
    })

    it('should return base64 encoded application/pdf with bucket and filename defined', ()=>{
      const queryStringParameters = { url, bucket, filename }
      const wrappedHandler = function( event, callback) {
        pdf( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters, "bucket": "test" }).then((response)=>{
        expect(response).to.be.a('Object')
      })
    })

  })

  describe('unhappy path', ()=>{

    let sbox = null

    beforeEach(()=>{
      sbox = sandbox.create() 
    })

    afterEach(()=>{
      sbox.restore()
    })

    it('should return error object', ()=>{
      const scLib = sbox.stub(pdfLib, 'default')
      scLib.resolves('string of text')
      const wrappedHandler = function( event, callback) {
        pdf( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ }).then((response)=>{
        expect(typeof response).to.equal('object')
      })
    })
  })

})

//SCREENSHOT TESTS
describe('screenshot', () => {

  describe('happy path', ()=>{

    let sbox = null

    beforeEach(()=>{
      sbox = sandbox.create() 
      let scLib = sbox.stub(screenshotLib, 'default')
      scLib.resolves('string of text')
      let upLib = sbox.stub(uploadUtil, 'default')
      upLib.resolves({"ETag":"\"f8127c63d717f974cb88e4a56c203c48\""})

    })

    afterEach(()=>{
      sbox.restore()
    })

    it('should return base64 encoded image/png', ()=>{
      const queryStringParameters = { url }
      const wrappedHandler = function( event, callback) {
        screenshot( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters }).then((response)=>{
        expect(response).to.be.a('Object')
        expect(response.body).to.be.a('string')
        expect(response.headers).to.be.a('Object')
        expect(response.headers['Content-Type']).to.equal('image/png')
      })
    })

    it('should return base64 encoded image/png where mobile is true', ()=>{
      const queryStringParameters = { url, "mobile": true }
      const wrappedHandler = function( event, callback) {
        screenshot( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters }).then((response)=>{
        expect(response).to.be.a('Object')
        expect(response.body).to.be.a('string')
        expect(response.headers).to.be.a('Object')
        expect(response.headers['Content-Type']).to.equal('image/png')
      })
    })

    it('should return base64 encoded image/png with bucket defined', ()=>{
      const queryStringParameters = { url, bucket }
      const wrappedHandler = function( event, callback) {
        screenshot( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters, "bucket": "test" }).then((response)=>{
        expect(response).to.be.a('Object')
      })
    })

    it('should return base64 encoded image/png with bucket and filename defined', ()=>{
      const queryStringParameters = { url, bucket, filename }
      const wrappedHandler = function( event, callback) {
        screenshot( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ queryStringParameters, "bucket": "test" }).then((response)=>{
        console.log({response})
        expect(response).to.be.a('Object')
      })
    })

  })

  describe('unhappy path', ()=>{

    let sbox = null

    beforeEach(()=>{
      sbox = sandbox.create() 
      let scLib = sbox.stub(screenshotLib, 'default')
      scLib.resolves('string of text')
      
    })

    afterEach(()=>{
      sbox.restore()
    })

    it('should return error object', ()=>{
      const wrappedHandler = function( event, callback) {
        screenshot( event, new context(), callback)
      }
      const promHandler = promisify(wrappedHandler, undefined, true)
      return promHandler({ }).then((response)=>{
        expect(typeof response).to.equal('object')
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