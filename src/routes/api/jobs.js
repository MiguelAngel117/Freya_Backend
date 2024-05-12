const {createJob,
    getJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    getJobsSortedByTitle,
    searchJobsByTitle, 
    uploadCV} = require('../../controllers/jobsController');
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');
const express = require('express');
const router = express.Router();
const multer = require('../../middleware/multer');

router.get('/search', searchJobsByTitle);
router.get('/sorted', getJobsSortedByTitle);
router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/uploadCV', multer.single('doc'), uploadCV);

router.post('/', checkAuth, checkRoleAuth(['admin']), createJob);

router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteJobById);

router.put('/:id', checkAuth, checkRoleAuth(['admin']), updateJobById);

module.exports = router;