# avrahammNodeFP
There is RESTful API for Users management written in Nodejs/Express and MongoDB/mongoose.

## Description:
<p>
The data is taken from 

- https://jsonplaceholder.typicode.com/users
- https://jsonplaceholder.typicode.com/todos
- https://jsonplaceholder.typicode.com/posts

and stored in MongoDB in 3 respective collections.
There are 4 restful resources: <br/>
- users, 
- todos, 
- posts, 
- phones.
</p>

<p>
     <b>Prerequisites</b> : you need to install
- Node 
- MongoDB 
- Robo visual tool - reccomended.
- Postman to try the application. 
</p>

<p>
     <b>Functionality: </b>
 HTTP VERBS GET, POST, PUT, PATCH, DELETE on each resource.  
</p>
     <b>Steps to reproduce</b>.

- 1) Create directory Node - or whatever name you want, cd Node
- 2) Inside there create directory changeLogs - name is important <br/>
     as it is defined as constant in code: <br/>
     nodefp/utils/LogHelper.js, function getLogFolder
     const LogFolderName = "/changeLogs";
- 3) In MongoDb create Database nodefpDB - name is important.
    nodefp/utils/DB.js file holds <br/>
    const MONGODB_CONNECTION_PATH = 'mongodb://localhost:27017/nodefpDB';
- 4) Clone: git clone https://github.com/avrahamm/avrahammNodeFP.git 
- 5) get into the directory, cd avrahammNodeFP
- 6) npm install - to install dependencies.
- 7) npm start , in server.js local server is set to listen on PORT 8002.
- 8) Open Postman, the urls on your local will be
     - http://localhost:8002/api/v1/users
     - http://localhost:8002/api/v1/todos
     - http://localhost:8002/api/v1/posts
     - http://localhost:8002/api/v1/phones
     </br>
     configure HTTP VERBS and request data and try.
</p>


