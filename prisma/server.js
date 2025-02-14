// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// POST link and method /api/members
app.post('/api/members', async (req, res) => {
  const { name, role } = req.body;

  try {
    const newMember = await prisma.member.create({
      data: {
        name,
        role,
      },
    });

    res.status(201).json({
      message: 'Member added successfully.',
      data: {
        id: newMember.id,
        name: newMember.name,
        role: newMember.role,
        created_at: newMember.createdAt,
        updated_at: newMember.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the member.', details: error.message });
  }
});

// GET link and method /api/projects/:id/members
app.get('/api/projects/:id/members', async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { members: { include: { member: true } } },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const assignedMembers = project.members.map(memberProject => ({
      id: memberProject.member.id,
      name: memberProject.member.name,
      role: memberProject.member.role,
      assigned_at: memberProject.assignedAt,
    }));

    res.json({ data: assignedMembers });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving members.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
