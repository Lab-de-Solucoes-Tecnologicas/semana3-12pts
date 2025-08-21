const express = require('express')

const app = express()

app.use(express.json())

function verifyLogin(req, res, next) {
    const {cpf, password} = req.headers;
    const searchByCPF = employees.find((searchByCPF) =>
        searchByCPF === cpfFormated(cpf)
    );
    if(!searchByCPF) {
        return res.status(400).json({
            error: "Funcionário não Localizado!"
        });
    };
    if(searchByCPF.cpf === cpfFormated(cpf) && searchByCPF.password === password){
        return next();
    } else {
        return res.status(400).json({
            error: "Login Inválido, Tente Novamente."
        });
    };
};

function verifyIfEmployeeExists(req, res, next) {
    const {classId} = req;
    for(const valueEmployee of employees) {
        for(const valueClass of valueEmployee.class) {
            if(valueClass === classId.id) {
                return res.status(400).json({
                    error: "Funcionário já cadastrado nesta turma!"
                });
            };
        };
    };
    return next();
};

app.get("/search/name", (req, res)=>{
    const {name} = req.body;
    const searchByName = employees.find((searchByName)=>
        searchByName.name === nameFormated(name)
    );
    if(!searchByName) {
        return res.status(400).json({
            error: "Funcionário não Identificado!"
        });
    };
    return res.status(200).send(searchByName);
});

app.get("/classes", (req, res)=>{
    return res.status(200).send(classes);
});

app.get("/search/classes/registration", verifyIfEmployeeExists, (req, res)=>{
    const {employee} = req;
    return res.status(200).send(employee.class);
});

app.get("/search/class", verifyIfClassExists, (req, res)=>{
    const {classId} = req;
    return res.status(200).send(classId);
});

app.put("/employee", verifyLogin, (req, res)=>{
    const {name, password, email, birthDate, cellPhone} = req.body;
    const {cpf} = req.headers;
    const searchByCPF = employees.find((searchByCPF) =>
        searchByCPF.cpf === cpfFormated(cpf)
    );
    if(!searchByCPF){
        return res.status(400).json({
            error: "Funcionário não Identificado!"
        });
    };
    searchByCPF.name = nameFormated(name);
    searchByCPF.password = password;
    searchByCPF.email = email;
    searchByCPF.birthDate = birthDate;
    searchByCPF.cellPhone = cellFormated(cellPhone);
    return res.status(200).send();
});

app.delete("/employee", verifyIfEmployeeExists, (req, res)=>{
    const {employee} = req;
    const index = employees.indexOf(employee);
    employees.splice(index, 1);
    return res.status(200).json(employees);
});

app.listen(3333)