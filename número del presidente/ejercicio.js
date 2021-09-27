const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};
const servidor=http.createServer((pedido ,respuesta) => {
    const objetourl = url.parse(pedido.url);
  let camino='public'+objetourl.pathname;
  if (camino=='public/')
    camino='public/index.html';
  encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);
function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/recuperardatos': {
      recuperar(pedido,respuesta);
      break;
    }	
    default : {  
      fs.stat(camino, error => {
        if (!error) {
        fs.readFile(camino,(error, contenido) => {
          if (error) {
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          } else {
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      } else {
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}


function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
    });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    const a=formulario['A'];
    const b=formulario['B'];
    let final=EsPrimo(a,b);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=`<!doctype html><html><head></head><body>${final}</body></html>`;
    respuesta.end(pagina);
    });
    
    function EsPrimo(a,b){
        let vector=[];
        let vector2=[];
        let resultado="";
        let mayor=b, menor=a;
        
        if(a>b){
            mayor=a;
            menor=b;
        }
        
        for(let x=menor;x<=mayor;x++){
            let es=true;
            for(let y=2;y<=x/2;y++){
                if(x%y==0){
                    es=false;
                }
            }
            if(es==true){
                vector.push(x);
            }
        }
        
        for(let x=0;x<vector.length;x++){
            let suma=0;
            let es2=true;
            let num=vector[x];
            while(num>0){
                suma+=(num%10);
                num=Math.floor(num/10);
            }
            for(let y=2;y<=suma/2;y++){
                if(suma%y==0){
                    nes=false;
                }
            }
            if(es2==true){
                vector2.push(vector[x]);
            }
        }
        
        for(let x=0;x<vector2.length;x++){
            resultado+=vector2[x]+"<br>";
        }
    return resultado;
        }
    
}
console.log('Servidor web iniciado');