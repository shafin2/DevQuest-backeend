import express from 'express';
import {
  createProject,
  getMyProjects,
  getProjectById,
  getMyInvites,
  acceptInvite,
  inviteDeveloper,
  getAllDevelopers,
} from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.js';
import { clientOnly, pmOnly } from '../middleware/rbac.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Project CRUD
router.post('/', clientOnly, createProject); // Only clients create projects
router.get('/my-projects', getMyProjects); // All roles can see their projects
router.get('/:id', getProjectById); // Access checked in controller

// Invitations
router.get('/invites/my-invites', getMyInvites); // All roles can see their invites
router.post('/invites/accept/:token', acceptInvite); // PM/Dev accept invites
router.post('/:id/invite-developer', pmOnly, inviteDeveloper); // Only PM invites devs

// Developer browsing (for PMs)
router.get('/developers/all', pmOnly, getAllDevelopers); // Only PM can browse devs

export default router;
