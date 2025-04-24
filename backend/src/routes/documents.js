const express = require('express');
const router = express.Router();
const DocumentService = require('../services/documentService');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const sortField = req.query.sortField || 'id';
    const sortOrder = req.query.sortOrder || 'ASC';

    const allowedSortFields = ['id', 'title', 'total'];
    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }

    const result = await DocumentService.getDocuments({
      page,
      search,
      sortField,
      sortOrder
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const document = await DocumentService.getDocumentById(req.params.id);
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    if (error.message === 'Document not found') {
      res.status(404).json({ error: 'Document not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  }
});

module.exports = router; 