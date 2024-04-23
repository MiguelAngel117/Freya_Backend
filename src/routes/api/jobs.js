const {createJob,
    getJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    getJobsSortedByTitle,
    searchJobsByTitle} = require('../../controllers/jobsController');
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');
const express = require('express');
const router = express.Router();

router.get('/search', checkAuth, checkRoleAuth(['admin','user']), searchJobsByTitle);
router.get('/sorted', checkAuth, checkRoleAuth(['admin','user']), getJobsSortedByTitle);
router.get('/', checkAuth, checkRoleAuth(['admin','user']), getJobs);
router.get('/:id', checkAuth, checkRoleAuth(['admin','user']), getJobById);

router.post('/', checkAuth, checkRoleAuth(['admin']), createJob);

router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteJobById);

router.put('/:id', checkAuth, checkRoleAuth(['admin']), updateJobById);

module.exports = router;