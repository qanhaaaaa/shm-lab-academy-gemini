"use strict";
const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const tutor=require('../api/tutor.js');
const root=path.resolve(__dirname,'../public');
const host=process.env.HOST||'127.0.0.1';
const port=Number(process.env.PORT||4173);
const allowed=new Set(['index.html','style.css','script.js','academy.css','academy.js']);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8'};
http.createServer(async(req,res)=>{
 const name=(req.url||'/').split('?')[0];
 if(name==='/api/tutor')return tutor(req,res);
 if(req.method!=='GET') {res.writeHead(405);return res.end('Method Not Allowed');}
 let file=name==='/'?'index.html':name.slice(1);
 if(!allowed.has(file)){res.writeHead(404);return res.end('Not Found');}
 try {const bytes=await fs.readFile(path.join(root,file));res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(bytes);}
 catch{res.writeHead(404);res.end('Not Found');}
}).listen(port,host,()=>console.log(`SHM Lab: http://${host}:${port} | Gemini ${process.env.GEMINI_API_KEY?'configured':'not configured (offline fallback)'}`));
