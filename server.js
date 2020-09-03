const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
// let pagination = 1;
const url = 'http://rostender.info/tender?p=';
const MongoClient = require("mongodb").MongoClient;

let id=0;

let mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true ,useUnifiedTopology: true});


mongoClient.connect(function(err, client){
   
    if(err){
        return console.log(err);
    }
    // взаимодействие с базой данных
    const db = client.db('Tenders');
    const collection = db.collection("tenderInfo");

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
            for( page = 8; page < 9; page++){
                console.log(page);
                await axios.get(url + page)
                    .then(response => {  
                        let getData = html => {
                            
                            const $ = cheerio.load(html);
                            $('.tender-row').each((i, header) => {
                                
                                const name = $(header).find("a.description").attr('title');
                                const price =  $(header).find(".starting-price").text().trim();
                                const address = $(header).find('div.tender-address div').text().trim();
                                
                                let dateEndWithText = ($(header).find('.tender-date-end').text().trim()).split(' ');
                                const date= [($(header).find('span.tender-date-info').text().trim()).split('.'), dateEndWithText[2].split('.')];

                                const dateStart = new Date(date[0][2],date[0][1],date[0][0]);
                                const dateEnd = new Date(date[1][2],date[1][1],date[1][0]);
                                
                                const link = $(header).find("a.description").attr('href');

                                searchCoords(address)
                                                .then(obj => {
                                                     obj.arrGeoObj=[];
                                                    // console.log(obj.coords)
                                                    obj.coords.forEach((element , i, arr)=> {
                                                        element.forEach((el,index,a) => {
                                                            a[index] = parseFloat(el);
                                                        });
                                                        obj.arrGeoObj.push(element);
                                                    });
                                                    return obj;
                                                })
                                                .then(obj =>{
                                                    typeOfTender=[];
                                                    for(j=0;j< $(header).find('.tender-costomer-branch a').length;j++){
                                                        typeOfTender.push(
                                                            $(header).find('.tender-costomer-branch a')[j].attribs.title
                                                        );
                                                    }

                                                    obj.arrGeoObj.forEach((el,index,arr) =>{

                                                        data = {
                                                            id: id,
                                                            name,
                                                            price,
                                                            coords: {
                                                                type: "Point",
                                                                coordinates: el
                                                            },
                                                            address: obj.addressArr[index],
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
                                                        
                                                    });
                                                    id++;
                                                })
                                                .catch(error => {
                                                    console.log('Ошибка: ', address);
                                                    console.log('Err: ',error);
                                }); 
                                // searchCoords(address);
                                
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
        let coords=[]; coord =[];  
        const geocoderUrl = 'https://geocode-maps.yandex.ru/1.x?apikey=28d74b24-f33d-4b35-8949-88142b0c9d92&lang=ru_RU&format=json&geocode=';
        
        let addressArr = address.split('; ');

        //разделение городов если нет '; '
        let arrNameCity;
        await addressArr.forEach((el, i, arr)=>{
            if(((el.split('г. ')).length - 1) > 1){
                arrNameCity = el.split('г. ');
                arrNameCity.splice(0,1);
                // console.log('arrCity', arrNameCity, el, arrNameCity.length);
                arrNameCity.push(el.split('г. '));
                arr.splice(i,1,arrNameCity);
            }
        });
        // console.log(addressArr);

        await URL(addressArr)//.then(c => {coords.push(c)});

        async function URL(addressArr){
            let c = []
            for(let i = 0;i<addressArr.length;i++){
           
                // console.log(addressArr[i])
                res = await axios.get(geocoderUrl+encodeURIComponent(addressArr[i]))
                                    .then(res => res.data);
                let coordArr = res.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
                // console.log(coordArr)
                // console.log(addressArr[i])
                c[0] = coordArr[1];
                c[1] = coordArr[0];
                // console.log('coord: ',coord)
                
                // coords.splice(0,0,coord);
                // coords.push(coord)
                // coords.push(c);
                coords[i]= c;
                c=[]
            }
            // return c;
        }
        
        console.log({
            coords,
            addressArr
        })
        
        return {
            coords,
            addressArr
        };
    }

    countPage();
});





    
    

