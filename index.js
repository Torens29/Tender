const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// let pagination = 1;
const url = 'http://rostender.info/tender?p=';
const MongoClient = require("mongodb").MongoClient;
 




async function f(){
    let promise = new Promise(function(resolve, reject) {
    let pagination
    axios.get(url + 1)
        .then(response =>{
            const $ = cheerio.load(response.data);
            pagination = $('li.last a').attr('data-page');
            console.log("f1 "+pagination);
            resolve(pagination) ;
        });
                    
    });

    // let result = await promise; 

    f2(await promise);
}

function f2(p){
    console.log("f2 "+ p);
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
    mongoClient.connect(function(err, client){
    
        if(err){
            return console.log(err);
        }
        // взаимодействие с базой данных
        const db = client.db('Tenders');
        const collection = db.collection("tenderInfo");


        // collection.insertOne(data, function(err, result){
        //     if(err){ 
        //         return console.log(err);
        //     }
        // });
        
        for( page = 1; page < p; page++){
        // console.log(page);
        axios.get(url + page)
            .then(response => {
                let getData = html => {
                    
                    const $ = cheerio.load(html);
                    $('.tender-row').each((i, header) => {
                        
                        const name = $(header).find("a.description").attr('title');
                        const price =  $(header).find(".starting-price").text();
                        const address = $(header).find('div.tender-address div').text();
                        const dateStart = $(header).find('span.tender-date-info').text();
                        const dateEnd = $(header).find('.tender-date-end').text();
                        const link = $(header).find("a.description").attr('href');
                        
                        typeOfTender=[];
                        for(j=0;j< $(header).find('.tender-costomer-branch a').length;j++){
                            typeOfTender.push(
                                $(header).find('.tender-costomer-branch a')[j].attribs.title
                            );
                        }

                        data = {
                            id: i,
                            name,
                            price,
                            address,
                            dateStart,
                            dateEnd,
                            link : "http://rostender.info"+ link,
                            typeOfTender
                        };

                        collection.insertOne(data, function(err, result){
                            if(err){ 
                                return console.log(err);
                            }
                        });
                    });
                    // console.log(data);
                };
                getData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        }
    
        client.close();
    });
}

f();







    
    

