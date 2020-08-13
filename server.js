const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// let pagination = 1;
const url = 'http://rostender.info/tender?p=';
const MongoClient = require("mongodb").MongoClient;
 
let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});

mongoClient.connect(function(err, client){
   
    if(err){
        return console.log(err);
    }
    // взаимодействие с базой данных
    const db = client.db('Tenders');
    const collection = db.collection("tenderInfo2");

    async function countPage(){
        let promise = new Promise(async function(resolve, reject) {
        let pagination;
        await axios.get(url + 1)
            .then(response =>{
                const $ = cheerio.load(response.data);
                pagination = $('li.last a').attr('data-page');
                console.log("f1 "+pagination);
                resolve(pagination) ;
            });
                        
        });

        // let result = await promise; 

        f2(await promise)//.then(() => {client.close()});
        
    }
        
    async function f2(p){ 
        console.log("f2 "+ p);
            // let coords = await searchCoords(address);
            for( page = 1; page < 2; page++){
                console.log(page);
                await axios.get(url + page)
                    .then(response => {  
                        let getData = html => {
                            
                            const $ = cheerio.load(html);
                            $('.tender-row').each((i, header) => {
                                
                                const name = $(header).find("a.description").attr('title');
                                const price =  $(header).find(".starting-price").text().trim();//replace(/\s+/g,' ');
                                const address = $(header).find('div.tender-address div').text().trim();//replace(/\s+/g,' ');
                                const dateStart = $(header).find('span.tender-date-info').text().trim();//replace(/\s+/g,' ');
                                const dateEnd = $(header).find('.tender-date-end').text().trim();//replace(/\s+/g,' ');
                                const link = $(header).find("a.description").attr('href');

                                
                                searchCoords(address)
                                                .then(coords => {
                                                    console.log(i, coords)
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
                                                        coords,
                                                        address,
                                                        dateStart,
                                                        dateEnd,
                                                        link : "http://rostender.info"+ link,
                                                        typeOfTender
                                                    };

                                                    collection.insertOne(data, function(err){
                                                        if(err){ 
                                                            return console.log(err);
                                                        }
                                                        
                                                    });
                                                    data={};
                                                })
                                                .catch(error => {
                                                    console.log('Err: ',error);
                                }); 
                                searchCoords(address);
                                
                            });
                            
                            // console.log(data);
                        };

                        getData(response.data);
                        return 'end';
                        
                    })
                   
                    .catch(error => {
                        console.log(error);
                    });
            }
            
    }

    async function searchCoords(address) {

        const geocoderUrl = 'https://geocode-maps.yandex.ru/1.x?apikey=28d74b24-f33d-4b35-8949-88142b0c9d92&lang=ru_RU&format=json&geocode=' +
        encodeURIComponent(address);
    // console.log('address', IfeaturesDB)
        let res = await axios.get(geocoderUrl)
                             .then(res => res.data)
                             .catch(err=>{return false;});
                // console.log('point Search  '+ i, res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' '));
        coordinates = res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
        // console.log('ОТВЕТ ',res.response.GeoObjectCollection.featureMember[0]);
        return coordinates;
    }

    countPage();
});





    
    

