import Datastore from 'nedb-promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Use Render persistent disk in production, local data dir in development
const dataDir = process.env.RENDER
  ? '/opt/render/project/src/data'
  : path.join(__dirname, '..', 'data')

const users = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true })
const products = Datastore.create({ filename: path.join(dataDir, 'products.db'), autoload: true })
const orders = Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true })
const requests = Datastore.create({ filename: path.join(dataDir, 'requests.db'), autoload: true })
const categories = Datastore.create({ filename: path.join(dataDir, 'categories.db'), autoload: true })

export { users, products, orders, requests, categories }
