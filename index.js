const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'http://rostender.info/tender?p=1';

axios.get(url)
    .then(response => {

        let getData = html => {
            data = [];
            const $ = cheerio.load(html);
            $('.tender-row').each((i, header) => {
                
                const title = $(header).find("a.description").attr('title');
                const link = $(header).find("a.description").attr('href');
                
                
                
                
                data.push({
                    id:i,
                    title: title.replace("\t",""),
                    link : "http://rostender.info"+ link
                });
            });
            console.log(data);
        };
        // fs.writeFile("hello.txt", response.data, function(error){
 
        //     if(error) throw error; // если возникла ошибка
        //     console.log("Асинхронная запись файла завершена.");
        // });

        // console.log(response.data);
        getData(response.data);
    })
    .catch(error => {
        console.log(error);
    });