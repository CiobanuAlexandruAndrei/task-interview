module.exports = {
  async up(queryInterface, Sequelize) {

    const documents = Array.from({ length: 9 }, (_, index) => ({
      title: `Document ${index + 1}`,
    }));

    await queryInterface.bulkInsert('documents', documents);
    
    const createdDocuments = await queryInterface.sequelize.query(
      'SELECT id FROM documents ORDER BY id ASC',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const documentRows = createdDocuments.flatMap(doc => ([
      {
        quantity: Math.floor(Math.random() * 10) + 1,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        documentId: doc.id,
      },
      {
        quantity: Math.floor(Math.random() * 10) + 1,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        documentId: doc.id,
      }
    ]));

    await queryInterface.bulkInsert('document_rows', documentRows);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('document_rows', null, {});
    await queryInterface.bulkDelete('documents', null, {});
  }
}; 