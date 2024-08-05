import Application from 'koa'

export interface IApp extends Application {
  db: any
  users: any
  http: any
  listen: any
  searchClient: any
}
