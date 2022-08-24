import Axios from 'axios'
import { baseURL } from '../env'
export const server = Axios.create({
  baseURL,
  timeout: 8000
})
