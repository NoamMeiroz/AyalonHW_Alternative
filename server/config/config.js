module.exports = {
   DB: "127.0.0.1:3306",
   dialect: "mysql",
   pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
   },
   employerFieldsName: {
      NAME: "שם חברה",
      SECTOR: "מגזר",
      PRIVATE_CAR: "רכב צמוד",
      SHUTTLE: "שאטלים",
      MASS_TRANSPORTATION: "הסעות",
      CAR_POOL: "Carpool",
      WORK_FROM_HOME: "עבודה מהבית"
   },
   sitesFieldsName: {
      NAME: "שם אתר",
      ADDRESS_CITY: "כתובת עבודה-עיר",
      ADDRESS_STREET: "כתובת עבודה-רחוב",
      ADDRESS_BUILDING_NUMBER: "כתובת עבודה-מספר בניין",
      NUM_OF_EMPLOYEES: "מספר עובדים",
   },
   employeeFieldsName: {
      WORKER_ID: "מזהה עובד",
      CITY: "עיר מגורים",
      STREET: "רחוב",
      BUILDING_NUMBER: "מספר בניין" 
   }
};