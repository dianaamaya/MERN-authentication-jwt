#TITLE

logging system with JWT using MERN Stack

#DESCRIPTION

This application allows users to sign in / sign up through the strategies: Local, Google and Facebook. This project was developed with MERN Stack (MongoDB, Express JS, React JS and Node JS) and JWT (Json Web Tokens - for authentication).

#INSTALATION

1. prepare Google/Facebook credentials
2. prepare database
3. Add environment Variables:
./.env
./client/src/config/auth.js
4. install the required modules in backend: npm install 
5. install the required modules in frontend: cd client - npm install

#RUN PROJECT

npm run server-dev - to run the backend server
npm run client-dev - to run the frontend server
npm run start-dev - to run backend and frontend servers

#STRUCTURE

- client : frontend server
    - src : all client files
        - actions: it contains all actions and types handled in the client
        - components: it contains all reactjs components
        - config: it contains required variables to run the project
        - reducers: it contains all reducers
        - index: file that handles all frontend side application
- server : backend server
    - config: authentication strategies
    - controllers: make requests to the database (taking into account the model)
    - helpers: user data validation (sent as parameters)
    - models: database schemes
    - routes: handles requests made by the client (call the authentication process, call the controller)
    - database: connection to the database
    - index: file that handles all backend side application
    - server: configurations of the backend server


#DESCRIPTION

Actions:

- User can create an account using local auth
- User can sign in using existing local account
- User can create an account using Google (OAuth)
- User can sign in using Google (OAuth)
- User can link/unlink the Google account to local account
- User can create an account using Facebook (OAuth)
- User can sign in using Facebook (OAuth)
- User can link/unlink the Facebook account to local account
- User can get dashboard information if it is authenticated

The creation of an account or the login in the application locally: 

- User fill a form to sign in / sign up
- User sends data (requests a token from the server - HTTP)
- If data is ok, user is signed in / signed up
- server sends a token through a cookie

The creation of an account or the login in the application by third parties (Google, Facebook) basically consists of the following: 

- User click on Google/Facebook buttons to sign in / sign up / link / unlink
- When buttons are clicked, it requests a token to third parties (Google, Facebook).
- Third parties redirect the user to a secure page in the service provider to sign in.
- The user authenticates on Facebook/Google.
- Third parties send a token to the client by oauth_callback parameter.
- Client sends the obtained token to the server (HTTP).
- If token validation is ok, it gets the current user data, and sign in / sign up / link / unlink
- Server sends a new token of the app through a cookie.

The checkAuth component is responsible for protecting routes, on the client side. In case the user is not authenticated, it will not be possible to access the private views (dashboard).

#TO IMPROVE

- add testing
- stylize pages






"# MERN-authentication-jwt" 
