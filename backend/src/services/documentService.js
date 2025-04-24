const { Document, DocumentRow, Sequelize } = require('../models');
const { Op } = Sequelize;

class DocumentService {
  static calculateTotal(rows = []) {
    if (!Array.isArray(rows)) {
      return 0;
    }

    const total = rows.reduce((sum, row) => {
      const quantity = Number(row.quantity) || 0;
      const price = Number(row.price) || 0;
      return sum + (quantity * price);
    }, 0);

    return Number(total.toFixed(2));
  }

  static formatDocument(document) {
    const plainDoc = document.get({ plain: true });
    return {
      id: plainDoc.id,
      title: plainDoc.title,
      total: this.calculateTotal(plainDoc.rows)
    };
  }

  static formatDocumentWithRows(document) {
    const plainDoc = document.get({ plain: true });
    return {
      id: plainDoc.id,
      title: plainDoc.title,
      rows: plainDoc.rows,
      total: this.calculateTotal(plainDoc.rows)
    };
  }

  static async getDocuments({ page = 1, limit = 5, search = '', sortField = 'id', sortOrder = 'ASC' }) {
    try {
      const offset = (page - 1) * limit;
      sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const whereClause = search 
        ? {
            title: {
              [Op.iLike]: `%${search}%` 
            }
          }
        : {};

      if (sortField === 'total') {
        const [orderedDocs] = await Document.sequelize.query(`
          SELECT 
            d.id,
            COALESCE(SUM(dr.quantity * dr.price), 0) as total
          FROM documents d
          LEFT JOIN document_rows dr ON dr."documentId" = d.id
          ${search ? 'WHERE d.title ILIKE :search' : ''}
          GROUP BY d.id
          ORDER BY total ${sortOrder}
          LIMIT :limit
          OFFSET :offset
        `, {
          replacements: {
            search: search ? `%${search}%` : '',
            limit,
            offset
          }
        });

        const orderedIds = orderedDocs.map(d => d.id);

        if (orderedIds.length === 0) {
          return {
            documents: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalDocuments: 0,
              hasNextPage: false,
              hasPreviousPage: page > 1
            }
          };
        }

        const documents = await Document.findAll({
          where: {
            id: orderedIds
          },
          include: [{
            model: DocumentRow,
            as: 'rows',
            attributes: ['quantity', 'price']
          }],
          order: [
            [Sequelize.literal(`ARRAY_POSITION(ARRAY[${orderedIds.join(',')}], "Document"."id")`)]
          ]
        });

        const [{ count }] = await Document.sequelize.query(`
          SELECT COUNT(*) as count
          FROM documents d
          ${search ? 'WHERE d.title ILIKE :search' : ''}
        `, {
          replacements: {
            search: search ? `%${search}%` : ''
          },
          type: Sequelize.QueryTypes.SELECT
        });

        const totalDocuments = parseInt(count);
        const totalPages = Math.ceil(totalDocuments / limit);

        return {
          documents: documents.map(doc => this.formatDocument(doc)),
          pagination: {
            currentPage: page,
            totalPages,
            totalDocuments,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        };
      } else {
        const totalDocuments = await Document.count({ where: whereClause });
        const documents = await Document.findAll({
          where: whereClause,
          include: [{
            model: DocumentRow,
            as: 'rows',
            attributes: ['quantity', 'price']
          }],
          order: [[sortField, sortOrder]],
          limit,
          offset,
          distinct: true
        });

        const totalPages = Math.ceil(totalDocuments / limit);

        return {
          documents: documents.map(doc => this.formatDocument(doc)),
          pagination: {
            currentPage: page,
            totalPages,
            totalDocuments,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        };
      }
    } catch (error) {
      throw new Error(`Error fetching documents: ${error.message}`);
    }
  }

  static async getDocumentById(id) {
    try {
      const document = await Document.findByPk(id, {
        include: [{
          model: DocumentRow,
          as: 'rows',
          attributes: ['quantity', 'price']
        }]
      });

      if (!document) {
        throw new Error('Document not found');
      }

      return this.formatDocumentWithRows(document);
    } catch (error) {
      throw new Error(`Error fetching document: ${error.message}`);
    }
  }
}

module.exports = DocumentService; 