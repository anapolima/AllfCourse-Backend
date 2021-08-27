// -----------------------------------------------------------------------------------------------//
// Archive: server.js
// Description: File responsible for configuring the application (Back-End)
// Data: 2021/08/27
// Author: Rey
// -----------------------------------------------------------------------------------------------//

require('module-alias/register');
const config = require('@config');
const app = require('./app');

// ----------------------------------------------------------------------------//
// --------------------------------server-port---------------------------------//
app.listen(config.app.port, (err) => {
    if (err) console.log(err);
    console.log(`Server listening on port ${config.app.port}`);
});
// --------------------------------server-port---------------------------------//
// ----------------------------------------------------------------------------//
