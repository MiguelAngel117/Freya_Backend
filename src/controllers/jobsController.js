const Job = require('../models/job');
const transporter = require('../middleware/     nodeMailer');

const createJob = async (req, res) => {
    try {
        /*const existingJob = await Job.findOne({ title: req.body.title });
        if (existingJob) {
            return res.status(400).send("A job with the same title already exists");
        }*/
        const create = await Job.create(req.body);
        res.status(201).send(create);
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).send("Error creating job - Internal Server Error");
    }
}

const uploadCV = async (req, res) => {
    try {
      const {destinatario, asunto, mensaje } = req.body;

      const mailOptions = {
        from: 'freyacolboy@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.messageId);
      res.status(200).send('Correo enviado exitosamente.');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).send('Error al enviar el correo.');
    }
  }

const getJobs = async (req, res) => {
    try {
        const listJobs = await Job.find();
        if (listJobs.length === 0) {
            res.status(200).send("NO JOBS REGISTERED");
            return;
        }
        res.status(200).send(listJobs);
    } catch (error) {
        console.error("Error getting jobs:", error);
        res.status(500).send("Error getting jobs - Internal Server Error");
    }
}

const getJobById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length === 24) {
            const job = await Job.findById(req.params.id);
            if (!job) {
                res.status(404).send("Job not found");
                return;
            }
            res.status(200).send(job);
        } else {
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error getting job by ID:", error);
        res.status(500).send("Error getting job by ID - Internal Server Error");
    }
}

const updateJobById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length === 24) {
            const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedJob) {
                res.status(404).send("Job not found to update");
                return;
            }
            res.status(200).send(updatedJob);
        } else {
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error updating job by ID:", error);
        res.status(500).send("Error updating job by ID - Internal Server Error");
    }
}

const deleteJobById = async (req, res) => {
    try {
        const id = req.params.id;
        if (id.length === 24) {
            const deletedJob = await Job.findByIdAndDelete(req.params.id);
            if (!deletedJob) {
                res.status(404).send("Job not found to delete");
                return;
            }
            res.status(200).send("Job deleted successfully");
        } else {
            res.status(400).send("INCOMPLETE ID");
        }

    } catch (error) {
        console.error("Error deleting job by ID:", error);
        res.status(500).send("Error deleting job by ID - Internal Server Error");
    }
}

const getJobsSortedByTitle = async (req, res) => {
    try {
        const sortedJobs = await Job.find().sort({ title: 1 });
        if (sortedJobs.length === 0) {
            res.status(200).send("NO JOBS REGISTERED");
            return;
        }
        res.status(200).send(sortedJobs);
    } catch (error) {
        console.error("Error getting jobs sorted by title:", error);
        res.status(500).send("Error getting jobs sorted by title - Internal Server Error");
    }
}

const searchJobsByTitle = async (req, res) => {
    try {
        const searchTerm = req.query.title;
        if (!searchTerm) {
            res.status(400).send("A search term is required");
            return;
        }
        const matchedJobs = await Job.find({ title: { $regex: searchTerm, $options: 'i' } });
        if (matchedJobs.length === 0) {
            res.status(404).send("No jobs found matching the search");
            return;
        }
        res.status(200).send(matchedJobs);
    } catch (error) {
        console.error("Error searching jobs by title:", error);
        res.status(500).send("Error searching jobs by title - Internal Server Error");
    }
}

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJobById,
    deleteJobById,
    getJobsSortedByTitle,
    searchJobsByTitle,
    uploadCV
};