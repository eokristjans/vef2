/**
 * Ný síða sýnir alla notendur á /admin. 
 * Notendanöfn, nöfn og netföng eru sýnd. 
 * Ef notandi er admin má viðkomandi breyta admin stöðu allra notanda. 
 * Það er gert með því að haka í checkbox og senda form. 
 * 
 * Athugið að hægt er að fá fylki af gildum til baka úr formi 
 * með því að gefa þeim name sem endar á [], t.d. name="admin[]". 
 * 
 * Eftir að notendur eru uppfærðir er farið aftur á /admin. 
 */

const express = require('express');

const router = express.Router;

/* todo */

module.exports = router;