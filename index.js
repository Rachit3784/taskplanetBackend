import http from "http"
import { app } from "./app.js"

const server = http.createServer(app);

const PORT = process.env.PORT || 4590;




server.listen(PORT , ()=>{
console.log(`server started at http://localhost:${PORT}`);
})