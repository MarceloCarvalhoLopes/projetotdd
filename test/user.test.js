let app       = require("../src/app");
let supertest = require("supertest");
let request   = supertest(app);

let mainUser = {name: "Marcelo Carvalho", email: "marcelolcarvalho@gmail.com", password:"123456"};

beforeAll(() =>{
    //insere usuário no banco
    return request.post("/user")
    .send(mainUser)
    .then(res =>{})
    .catch(err => {console.log(err)})
})

afterAll(() =>{
    //remove usuário no banco
    return request.delete(`/user/${mainUser.email}`)
    .then(res => {})
    .catch(err => {console.log(err)})
})


describe("Cadastro de usuário", () => {

    test("Deve cadastrar um usuário com sucesso",() =>{
        
        let time = Date.now();
        let email = `${time}@gmail.com`
        
        let user = {
            name : "Marcelo",
            email,
            password: "123456"
        }

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);                     
        }).catch(err => {
            //fail(err);
            throw new Error(err);
        });

    });

    test("Deve impedir que um usuário se cadastre com os dados vazios", () =>{

        let user = {
            name : "",
            email : "",
            password: ""
        }

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400); //bad request
        }).catch(err => {
            //fail(err);
            throw new Error(err);
        });


    });

    test("Deve impedir que um usuário se cadastre com email repetido", () =>{

        let time = Date.now();
        let email = `${time}@gmail.com`
        
        let user = {
            name : "Marcelo",
            email,
            password: "123456"
        }

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);                     

            return request.post("/user")
            .send(user)
            .then(res => {

                expect(res.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadastrado");

            }).catch(err => {
                throw new Error(err);
            })


        }).catch(err => {
            //fail(err);
            throw new Error(err);
        });

  
        
    });

})