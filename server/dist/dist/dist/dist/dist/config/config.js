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
    NUM_OF_EMPLOYEES: "מספר עובדים"
  },
  employeeFieldsName: {
    WORKER_ID: "מזהה עובד",
    CITY: "עיר מגורים",
    STREET: "רחוב",
    BUILDING_NUMBER: "מספר בניין"
    /*SHORT_HOURS_GRADE: "ציון-קיצור שעות עבודה",
    SHIFTING_HOURS_GRADE: "ציון-הזזת זמן הגעה",
    BICYCLE_GRADE: "ציון-אופניים",
    SCOOTER_GRADE: "ציון-קורקינט",
    PERSONALIZED_SHUTTLE_GRADE: "ציון-שאטל מותאם אישית",
    WORK_SHUTTLE_GRADE: "ציון-שאטל ממקום העבודה",
    CARSHARE_GRADE: "ציון-שיתוף מוכניות",
    CARPOOL_GRADE: "ציון-שיתוף נסיעה",
    CABSHARE_GRADE: "ציון-שיתוף מונית",
    PUBLIC_TRANSPORT_GRADE: "ציון-תחבורה ציבורית",
    WALKING_GRADE: "ציון-הליכה",
    WORKING_FROM_HOME_GRADE: "ציון-עבודה מהבית",
    SHARED_WORKSPACE_GRADE: "ציון-מתחם עבודה משותף",
    SHIFTING_WORKING_DAYS_GRADE: "ציון-שינוי ימי עבודה"*/

  }
};