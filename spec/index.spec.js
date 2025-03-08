var request = require("supertest");
const [app,messages] = require('../index');

const dummyMessage = {
    name: "Sample Name",
    message: "Sample Message",
    id: 1
}

describe('Application', () => {
    it('should have no messages at start', (done) => {
        request(app).get("/messages")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.length).toBe(0);
                expect(messages.length).toBe(0);
                done();
            });
   });
    it('should take message', (done) => {
        var initLength = messages.length;
         request(app).post("/messages").send(dummyMessage).expect(201)
            .end((err, res) => {
                if (err) return done(err);
                //console.log(JSON.stringify(res))
                expect(res.text).toBe("added");
                expect(messages.length).toBe(initLength+1);
                expect(messages.findIndex((message=>message.id==dummyMessage.id))).not.toBe(-1);
                done();
            });
    });
    it('should return message', (done) => {
        request(app).get("/messages")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.length).toBe(1);
                done();
            });
    });
    it("should return message by name", (done)=>{
        request(app).get(`/messages/${dummyMessage.name}`)
        .expect(200)
        .end((err,res)=>{
            if(err) return done(err);
            expect(res.body).toEqual([dummyMessage]);
            done();
        });
    });
    it("should delete message", (done)=>{
        var initLength = messages.length;
        request(app).delete("/messages").send({'messageId': dummyMessage.id})
        .expect(200)
        .end((err,res)=>{
            if(err) return done(err);
            expect(res.body.status).toBe("deleted");
            request(app).get("/messages")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.length).toBe(0);
                expect(messages.length).toBe(initLength-1);
            });
            done();
        });
    });
})