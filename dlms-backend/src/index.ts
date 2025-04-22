import express from 'express'
import cors from 'cors'
import { program } from './utils'
import { fetchAllProjects, fetchProjectByManagerAddress, fetchProjectByPublicKey, fetchSystemState, fetchUserState, fetchUserStateByAuthority, fetchUserStateByPublicKey } from './constructors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.get('/system-state', fetchSystemState);

app.get('/user-state', fetchUserState);

app.get('/user-by-address/:userAddress', fetchUserStateByPublicKey);

app.get('/user-by-authority/:authority', fetchUserStateByAuthority);

app.get('/projects', fetchAllProjects);

app.get('/project-by-address/:projectAddress', fetchProjectByPublicKey);

app.get('/project-by-manager/:managerAddress', fetchProjectByManagerAddress);

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})