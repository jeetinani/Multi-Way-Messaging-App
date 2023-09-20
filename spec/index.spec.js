const { type } = require("express/lib/response");
var request = require("request");

describe('calc',()=>{
    it('should be double',()=>{
        expect(2*2).toBe(4);
    })
})


describe('getMessages',()=>{
    it('should give 200 OK',(done)=>{
        request.get("http://localhost:3000/messages",(err, resp, body)=>{
            expect(resp.statusCode).toEqual(200);
            done();
        })
    })
    it('should give non empty list',(done)=>{
        request.get("http://localhost:3000/messages",(err, resp, body)=>{
            expect(JSON.parse(body).length).toBeGreaterThan(0);
            done();
        })
    })
    it('should give user\'s messages',(done)=>{
        request.get("http://localhost:3000/messages/Jeet",(err, resp, body)=>{
            expect(JSON.parse(body).length).toBeGreaterThan(0);
            done();
        })
    })
})