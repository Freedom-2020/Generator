const express = require('express')
const bodyParser = require("body-parser");
const fs = require('fs');
const templeteForm = require( "./TempleteCode/React/AntReduxTs/V1/form" );
const templeteFormSlice = require( "./TempleteCode/React/AntReduxTs/V1/formSlice" );

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/save', (request, response) =>{
    fs.writeFile(
        `${request.body.filePath}/${request.body.moduleName.charAt(0).toUpperCase() + request.body.moduleName.slice(1)}.tsx`, 
        templeteForm.generateForm(request.body), 
        function (err) {
            if (err) throw err;
            console.log('Saved!');
            fs.writeFile(
                `${request.body.filePath}/${request.body.moduleName.charAt(0).toUpperCase() + request.body.moduleName.slice(1)}Slice.ts`, 
                templeteFormSlice.generateFormSlice(request.body), 
                function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                    fs.writeFile('./formRule.json', JSON.stringify(request.body.cards,null,4), function(){})
                    response.send(JSON.stringify(true))
                }
            );
        }
      );
    
})

app.get('/api/get', (request, response) => {
    const data = fs.readFileSync('./formRule.json', 'utf-8')
    response.send(data)
})

app.get('/api/getTree', (request, response) => {
    const data=[
    {
        value: '1',
        label: 'label1',
        key: '1',
        children:[
            {
                value: '1-1',
                label: 'label1-1',
                key: '1-1',
                children: [
                    {
                        value: '1-1-1',
                        label: 'label1-1-1',
                        key: '1-1-1',
                    }
                ]
            },
            {
                value: '1-2',
                label: 'label1-2',
                key: '1-2',
            }
        ]
    },
    {
        value: '2',
        label: 'label2',
        key: '2',
        children:[
            {
                value: '2-1',
                label: 'label2-1',
                key: '2-1',
            }
        ]
    }
]
    response.send(JSON.stringify(data))
})

app.listen(3301, () => {
    console.log(`Server running`)
})