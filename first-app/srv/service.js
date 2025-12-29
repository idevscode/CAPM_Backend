const cds = require('@sap/cds');
module.exports = cds.service.impl(function() {
    const {Orders} = this.entities;

    this.before('CREATE', Orders, (req) => {
        console.log('line no 6');
        const {amount} = req.data;
    
    
    // Validation for amount
    if(amount == null || amount <= 0){
        req.error(400, 'Amount must be greater than 0');
    }

    //Business rule required
    if(amount >= 1000){
        req.data.status = 'APPROVAL_REQUIRED';
    } else {
        req.data.status = 'CREATED';
    }
    });

    // AFTER CREATE → log for debugging purpose
    this.after('CREATE', Orders, (response) => {
        console.log('line no 25');
         if(response.ID != null){
            console.log('Order created successfully with ID: and status ', response.ID, response.status);
            return;
         }
    });

    this.before('*', Orders, async (req) => {
        console.log('line no 32');
        const {amount} = req.data;
        if(req.method === 'PATCH' && req.event === 'UPDATE') {
          const { ID } = req.data;         
          console.log('req: ', req); 
          const existing = SELECT.one.from(Orders).where( { ID } );
          console.log('ID: ', ID);
          console.log('existing: ', existing);
          if(!existing) {
            req.error(404, 'Order not found');
          } else {
            if(amount >= 1000){
                   req.data.status = 'UPDATED_APPROVAL_REQUIRED';
            } else {
                   req.data.status = 'CREATED';
            }
          }
        } else {
            console.log('Not a patch method type');
            // req.error(400, 'Method type must be patch');
        }
         
    });
});