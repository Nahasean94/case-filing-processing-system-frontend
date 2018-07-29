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
const isCaseCategoryExists = `
   query($name:String!) {
  isCaseCategoryExists(name:$name) {
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

export {
    registerAdvocate,
    isAdvocateExists,
    adminExists,
    advocateLogin,
    login,
    registerAdmin,
    signin,
    isCourtStationExists,
    isCaseCategoryExists,
    addCourtStation,
    courtStations,
    addCaseCategory,
    caseCategories,
    formFeeStructures,
    isFormFeeStructureExists,
    addFormFeeStructure,
    courtAdminLogin,
    isCourtAdminExists,
    registerCourtAdmin
}
