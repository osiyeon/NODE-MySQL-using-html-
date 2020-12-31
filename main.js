var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var mysql = require('mysql2')

// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '+++++',
  database: 'testing'
});


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log(queryData)
    // console.log(pathname)
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query(`select * from posting`, function(error, postings){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(postings);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);  
          response.end(html);
        })
      } else {
        db.query(`select * from posting`, function(error, postings){
          if (error){
            throw error;
          }
          db.query(`select * from posting where id=?`,[queryData.id],function(error2, topic){
            if (error2){
              throw error2;
            }
            console.log(topic[0].title)
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(postings);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
        );
            response.writeHead(200);
            response.end(html);
  
          })
        })
      }
    } else if(pathname === '/create'){
      db.query(`select * from posting`, function(error, postings){
        var title = 'Create';
        var list = template.list(postings);
        var html = template.HTML(title, list,
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      })

    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(
            `insert into posting (title, description, created, user_id) 
            values (?, ?, NOW(), ?);`,
            [post.title, post.description, 1],
            function(error, result){
              if(error){
                throw error;
              } 
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          )
      });
    } else if(pathname === '/update'){
      db.query(`select * from posting`, function(error, postings){
        if(error){
          throw error;
        }
        db.query(`select * from posting where id=?`, [queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(postings);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${queryData.id}"> 
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>`
          ); //첫번째 value에 수정하고자하는 id 값이 들어가야함. queryData.id랑 다른점이 뭐지?
          // 마지막 id 값 역시 topic[0].id 로
          // 상관없는거 같음. 
          // 페이지 검사했을 때 hidden 에 들어가는 값이 동일하다.
          response.writeHead(200);
          response.end(html);

          })
      })
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(
            `update posting
            set title = ?, description= ?
            where id = ?`, 
            [post.title, post.description, post.id], // 이 부분에서 post.id 대신 queryData.id 로 하면 update 실행이 안됨. 
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location:`/?id=${post.id}`}); //  이 부분에서 post.id 대신 queryData.id 로 하면 다음 페이지로 넘어가질 않음 id 값이 undefined가 됨. 디비 상에서는 바뀌는데 페이지 라우팅 안됨.
            response.end();
          })
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          db.query(`delete from posting where id = ?`,[id], 
          function(error, topic){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
