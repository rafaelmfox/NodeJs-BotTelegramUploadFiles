const Telegraf = require('telegraf')
const env = require('../config/.env')
const bot = new Telegraf(env.token)
//const Markup = require('telegraf/markup') //teclado no telegram
const db = require('../database/index')
const axios = require('axios')


const fs = require('fs');
const request = require('request');
require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');


//CTRL +  ALT + N > START
//CTRL +  ALT + M > BREAK
//https://stackoverflow.com/questions/59312499/how-should-i-download-received-files-from-telegram-api

//Primeiro passo a msg que vai aparecer
bot.start((ctx) => {
    const primeiroNomeUsuario = ctx.from.first_name
    ctx.reply('Oi, Seja bem vindo: '+primeiroNomeUsuario)
    //ctx.reply('eu sou o seu bot \ncomo posso estar te ajudando?')
});
const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};

bot.use( async ctx => {
    try{
    console.log("1")

    console.log(ctx)

    const nomearquivo = ctx.message.document.file_name
    const fileId = ctx.message.document.file_id
    console.log("2")

    const res = await fetch(
        `https://api.telegram.org/bot${env.token}/getFile?file_id=${fileId}`
      );
      console.log("3")

      const res2 = await res.json();
      console.log("4"+JSON.stringify(res2))

      const filePath = res2.result.file_path;
      console.log("5"+filePath)

      const downloadURL = `https://api.telegram.org/file/bot${env.token}/${filePath}`;
      console.log("6")

      download(downloadURL, path.join(__dirname, `${nomearquivo}`), () =>
      console.log('Done!')
      
     );
     ctx.reply('Arquivo baixado no servidor')
    }
    catch (e){
        console.log(e)
        ctx.reply('Acho que deu erro :D ou o arquivo nao existe mais para download')
    }

})


bot.startPolling()