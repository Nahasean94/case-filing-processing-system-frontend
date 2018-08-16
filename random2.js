var request = require('request')



const url = "https://classmite.com/confirm_payment.php"
request(
    {
        method: 'POST',
        url: url,
        json: {
            "checkout_id": "ws_CO_DMZ_63640639_16082018231156915"
        }
    },
    function (error, response, body) {
        // TODO: Use the body object to extract the response
        console.log(body)
    }
)
