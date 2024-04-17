import express, { Express, Request, Response, NextFunction } from "express"
const app: Express = express()

app.get("/", function (req: Request, res: Response, next: NextFunction) {
    res.send("ok")
})

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    // Handle errors here
    console.error(err.stack)
    res.status(500).send("Something broke!")
})
// // EXPORT
// module.exports = app

export default {
    path: "/api",
    handler: app,
}
