const advocateLogin = `
   mutation($practice_number:Int!,$password:String!) {
  advocateLogin(practice_number:$practice_number,password:$password) {
    token
    ok
    error
  }
}
`
const registerAdvocate = `
   mutation($practice_number:Int!,$surname:String,$first_name:String!,$last_name:String!, $dob:String!,$gender:String!, $password:String!,$email:String!,$cellphone:Long!,){          
  registerAdvocate(practice_number:$practice_number,surname:$surname,first_name:$first_name,last_name:$last_name, dob:$dob,gender:$gender, password:$password,email:$email,cellphone:$cellphone){
        id
    }
}
`
const isAdvocateExists = `
   query($practice_number:Int!) {
  isAdvocateExists( practice_number:$practice_number) {
   exists
  }
}
`
const isCourtStationExists = `
   query($name:String!) {
  isCourtStationExists(name:$name) {
   exists
  }
}
`
const findPendingCases = `
   query($advocate:ID!) {
  findPendingCases(advocate:$advocate) {
   id
   case_number{
   prefix
   suffix
  }
  timestamp
  title
}
}
`
const findCourtPendingCases = `
   query($court_station:ID!) {
  findCourtPendingCases(court_station:$court_station) {
   id
   case_number{
   prefix
   suffix
  }
  advocate{
  surname
  }
  timestamp
  title
}
}
`
const addCourtStation = `
   mutation($name:String!) {
  addCourtStation(name:$name) {
   id
   name
  }
}

`
const login = `
   mutation($username:String!,$password:String!) {
  login(username:$username,password:$password) {
    token
    ok
    error
  }
}
`
const adminExists = `
   {
  adminExists{
   exists
  }
}`
const registerAdmin = `
mutation($username:String!,$password:String!){
registerAdmin(username:$username,password:$password){
id
}
}`
const courtAdminLogin = `
   mutation($username:String!,$password:String!,$court_station:ID!) {
  courtAdminLogin(username:$username,password:$password,court_station:$court_station) {
    token
    ok
    error
  }
}
`
const isCourtAdminExists = `
   query($court_station:ID!){
  isCourtAdminExists(court_station:$court_station){
   exists
  }
}`
const registerCourtAdmin = `
mutation($username:String!,$password:String!,$court_station:ID!){
registerCourtAdmin(username:$username,password:$password,court_station:$court_station){
id
}
}`
const courtAssistantLogin = `
   mutation($username:String!,$password:String!,$court_station:ID!) {
  courtAssistantLogin(username:$username,password:$password,court_station:$court_station) {
    token
    ok
    error
  }
}
`
const isCourtAssistantExists = `
   query($court_station:ID!){
  isCourtAssistantExists(court_station:$court_station){
   exists
  }
}`
const getCourtAssistant = `
   query($court_station:ID!){
  getCourtAssistant(court_station:$court_station){
   id
   username
  }
}`
const getDeputyRegistrar = `
   query($court_station:ID!){
  getDeputyRegistrar(court_station:$court_station){
   id
   username
  }
}`
const registerCourtAssistant = `
mutation($username:String!,$password:String!,$court_station:ID!){
registerCourtAssistant(username:$username,password:$password,court_station:$court_station){
id
username
}
}`
const deputyRegistrarLogin = `
   mutation($username:String!,$password:String!,$court_station:ID!) {
  deputyRegistrarLogin(username:$username,password:$password,court_station:$court_station) {
    token
    ok
    error
  }
}
`
const isDeputyRegistrarExists = `
   query($court_station:ID!){
  isDeputyRegistrarExists(court_station:$court_station){
   exists
  }
}`
const registerDeputyRegistrar = `
mutation($username:String!,$password:String!,$court_station:ID!){
registerDeputyRegistrar(username:$username,password:$password,court_station:$court_station){
id
}
}`

const courtStations = `
   {
  courtStations{
   id
   name
  }
}
`
const caseCategories = `
   {
  caseCategories{
   id
   name
  }
}
`
const caseTypes = `
   {
  caseTypes{
   id
   name
  }
}
`
const isCaseCategoryExists = `
   query($name:String!) {
  isCaseCategoryExists(name:$name) {
   exists
  }
}
`
const isCaseTypeExists = `
   query($name:String!) {
  isCaseTypeExists(name:$name) {
   exists
  }
}
`
const addCaseCategory = `
   mutation($name:String!) {
  addCaseCategory(name:$name) {
   id
   name
  }
}`
const addCaseType = `
   mutation($name:String!) {
  addCaseType(name:$name) {
   id
   name
  }
}`
const formFeeStructures = `
   {
  formFeeStructures{
   id
   name
   fee
  }
}
`
const isFormFeeStructureExists = `
   query($name:String!) {
  isFormFeeStructureExists(name:$name) {
   exists
  }
}
`
const addFormFeeStructure = `
   mutation($name:String!,$fee:Int!) {
  addFormFeeStructure(name:$name,fee:$fee) {
   id
   name
   fee
  }
}`
const signin = `
mutation($practice_number:Int!,$signin:String!,$date:String!){
signin(practice_number:$practice_number,signin:$signin,date:$date){
id
practice_number
signin
date
}
}`
const addNewForm = `
mutation($type_of_form:ID!,$file:Upload!){
addNewForm(type_of_form:$type_of_form,file:$file){
id
}
}`
const addOrganization = `
mutation($name:String!,$email:String!,$cellphone:Long!){
addOrganization(name:$name,email:$email,cellphone:$cellphone){
id
}
}`
const addIndividual = `
mutation($name:String!,$email:String!,$cellphone:Long!,$dob:String!,$gender:String!){
addIndividual(name:$name,email:$email,cellphone:$cellphone,dob:$dob,gender:$gender){
id
}
}`
const makePayment = `
mutation($fee:Int!){
makePayment(fee:$fee){
id
}
}`
const findCaseInfo = `
query($id:ID!){
findCaseInfo(id:$id){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
hearing{
date
judge
}

defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}
}
}`


const addNewCase = `
mutation(
$title:String!,
$description:String!,
$court_station:ID!,
$case_type:ID!,
$case_category:ID!,
$defendant_party_type:String!,
$defendant_name:String!,
$defendant_email:String!,
$defendant_cellphone:Long!,
$plaintiff:ID!,
$plaintiff_type:String!,
$form:ID!,
$payment:ID!){
addNewCase(title:$title,
description:$description,
court_station:$court_station,
case_type:$case_type,
case_category:$case_category,
defendant_party_type:$defendant_party_type,
defendant_name:$defendant_name,
defendant_email:$defendant_email,
defendant_cellphone:$defendant_cellphone,
plaintiff:$plaintiff,
plaintiff_type:$plaintiff_type,
form:$form,
payment:$payment){
id
}
}`
const findCaseForms = `
{
findCaseForms{
id
name
fee
}
}`
const findServedCases = `
query($prefix:Int!){
findServedCases(prefix:$prefix){
id
title
case_number{
prefix
suffix
}
}
}`
const makeMpesaPayment = `
query($phone_number:Long!){
makeMpesaPayment(phone_number:$phone_number){
MerchantRequestID
CheckoutRequestID
ResponseCode
ResponseDescription
CustomerMessage
}
}`
const confirmPayment = `
query($checkout_id:String!){
confirmPayment(checkout_id:$checkout_id){
payment_id
merchant_id
phone_no
amount_paid
result_code
result_description
mpesa_refno
transaction_date
checkout_id
}
}`

const serveDefendant = `
mutation($id:ID!,$message:String!){
serveDefendant(id:$id,message:$message){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
hearing{
date
judge
}

timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}

}
}`
const addHearingInfo= `
mutation($id:ID!,$date:String!,$judge:String!,$text:String){
addHearingInfo(id:$id,date:$date,judge:$judge,text:$text){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
hearing{
date
judge
}
timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}

}
}`

const onSuspendCase= `
mutation($id:ID!,$description:String!,$text:String){
onSuspendCase(id:$id,description:$description,text:$text){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
hearing{
date
judge
}

timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}

}
}`

const onAddVerdict= `
mutation($id:ID!,$description:String!,$text:String){
onAddVerdict(id:$id,description:$description,text:$text){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
hearing{
date
judge
}

timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}

}
}`

const searchCourtCases= `
query($state:String!,$search:String!){
searchCourtCases(state:$state,search:$search){
 id
 title
description
case_number{
  prefix
  suffix
 }
plaintiff {
    party_type
    party_id
    {
id
email
cellphone
name

    }
}
status{
state
text
timestamp
}
defendant{
    party_type
    name
    email
    cellphone
    served{
    text
    timestamp
    }
}
court_station{
    name
}
case_type {
    name
}
case_category {
   name
}
form{
   type_of_form{
   name
   }
   path
}
payment {
   fee
}
judge
verdict{
description
date
}
hearing{
date
judge
}

timestamp
registrar_approval
advocate{
    surname
    first_name
    last_name
    practice_number
    email
    cellphone
}

}
}`

export {
    searchCourtCases,
    onAddVerdict,
    onSuspendCase,
    addHearingInfo,
    serveDefendant,
    makeMpesaPayment,
    confirmPayment,
    findServedCases,
    findCaseForms,
    addNewCase,
    addNewForm,
    makePayment,
    addIndividual,
    addOrganization,
    registerAdvocate,
    isAdvocateExists,
    adminExists,
    advocateLogin,
    login,
    registerAdmin,
    signin,
    isCourtStationExists,
    isCaseCategoryExists,
    isCaseTypeExists,
    addCourtStation,
    courtStations,
    addCaseCategory,
    addCaseType,
    caseCategories,
    caseTypes,
    formFeeStructures,
    isFormFeeStructureExists,
    addFormFeeStructure,
    courtAdminLogin,
    isCourtAdminExists,
    registerCourtAdmin,
    courtAssistantLogin,
    isCourtAssistantExists,
    registerCourtAssistant,
    deputyRegistrarLogin,
    isDeputyRegistrarExists,
    registerDeputyRegistrar,
    getCourtAssistant,
    getDeputyRegistrar,
    findPendingCases,
    findCourtPendingCases,
    findCaseInfo

}
