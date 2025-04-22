import express from 'express'
import cors from 'cors'
import { program } from './utils'
import { 
  fetchAllApplications,
  fetchAllProjects, 
  fetchApplicationByLabour, 
  fetchApplicationByProject, 
  fetchProjectByManagerAddress, 
  fetchProjectByPublicKey, 
  fetchSystemState, 
  fetchUserState, 
  fetchUserStateByAuthority, 
  fetchUserStateByPublicKey, 
  getAllReviews, 
  getReviewOfUser 
} from './constructors'

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

app.get('/reviews', getAllReviews );

app.get('/reviews/:reviewerAddress', getReviewOfUser );

app.get('/applications', fetchAllApplications);

app.get('/application-by-labour/:labourAddress', fetchApplicationByLabour);

app.get('/application-by-project/:projectAddress', fetchApplicationByProject);

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})