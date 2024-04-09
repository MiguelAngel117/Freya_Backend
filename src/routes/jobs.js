const {createJob,
    getJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    getJobsSortedByTitle,
    searchJobsByTitle} = require('../controllers/jobsController');
const express = require('express');
const router = express.Router();

router.get('/search', searchJobsByTitle);
router.get('/sorted', getJobsSortedByTitle);
router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', createJob);

router.delete('/:id', deleteJobById);

router.put('/:id', updateJobById);

module.exports = (app) => app.use("/api/v1/jobs", router);