"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const constructors_1 = require("./constructors");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.get('/system-state', constructors_1.fetchSystemState);
app.get('/user-state', constructors_1.fetchUserState);
app.get('/user-by-address/:userAddress', constructors_1.fetchUserStateByPublicKey);
app.get('/user-by-authority/:authority', constructors_1.fetchUserStateByAuthority);
app.get('/projects', constructors_1.fetchAllProjects);
app.get('/project-by-address/:projectAddress', constructors_1.fetchProjectByPublicKey);
app.get('/project-by-manager/:managerAddress', constructors_1.fetchProjectByManagerAddress);
app.get('/reviews', constructors_1.getAllReviews);
app.get('/reviews/:reviewerAddress', constructors_1.getReviewOfUser);
app.get('/applications', constructors_1.fetchAllApplications);
app.get('/application-by-labour/:labourAddress', constructors_1.fetchApplicationByLabour);
app.get('/application-by-project/:projectAddress', constructors_1.fetchApplicationByProject);
app.post('/register-user', constructors_1.registerUser);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
