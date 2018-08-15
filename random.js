var request = require('request'),
    oauth_token = "U1BMd0xkMnVBM29ub1BSWENKRjZiV3FXR3hOdkE4Qlo6NldPZ2hNQUdUdUVZS2pYMw==",
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
auth = "Bearer " + oauth_token;

request(
    {
        method: 'POST',
        url : url,
        headers : {
            "Authorization" : auth
        },
        json : {
            "BusinessShortCode": " ",
            "Password": " ",
            "Timestamp": " ",
            "TransactionType": "CustomerPayBillOnline",
            "Amount": " ",
            "PartyA": " ",
            "PartyB": " ",
            "PhoneNumber": " ",
            "CallBackURL": "https://ip_address:port/callback",
            "AccountReference": " ",
            "TransactionDesc": " "
        }
    },
    function (error, response, body) {
        // TODO: Use the body object to extract the response
        console.log(body)
    }
)



$title:String!,
$description:String!,
$court_station:ID!,
$case_type:ID!,
$case_category:ID!,
$defendant_party_type:String!,
$defendant_name:String!,
$defendant_email:String!,
$defendant_cellphone:Int!,
$plaintiff:ID!,
$plaintiff:String!,
$form:ID!,
$payment:Int!,

