const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let pagination = 1;

const url = 'http://rostender.info/tender?p=';


axios.get(url + pagination)
    .then(response =>{
        const $ = cheerio.load(response.data);
        pagination = $('li.last a').attr('data-page');
        console.log(pagination);
    });
page=5
for(page; page==1; page--){
    axios.get(url + pagination)
        .then(response => {
            let getData = html => {
                data = [];
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

                    data.push({
                        id:i,
                        name,
                        price,
                        address,
                        dateStart,
                        dateEnd,
                        link : "http://rostender.info"+ link,
                        typeOfTender
                    });
                });
                console.log(data);
            };
            getData(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}

