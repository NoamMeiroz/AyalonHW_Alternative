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
      NUMBER_OF_EMPLOYEES: "מספר עובדים",
      NUMBER_OF_SITES: "מספר סניפים",
      PRIVATE_CAR: "רכב צמוד",
//      SHUTTLE: "שאטלים",
      MASS_TRANSPORTATION: "שירות הסעות",
      CAR_POOL: "Carpool",
      WORK_FROM_HOME: "עבודה מהבית"
   },
   branchesFieldsName: {
      SITE_ID: "מספר סניף",
      NAME: "שם סניף",
      ADDRESS_CITY: "עיר",
      ADDRESS_STREET: "רחוב",
      ADDRESS_BUILDING_NUMBER: "מספר"
//      NUM_OF_EMPLOYEES: "מספר עובדים",
   },
   employeeFieldsName: {
      WORKER_ID: "מזהה עובד",
      BRANCH_ID: "מס\"ד סניף",
      CITY: "עיר מגורים",
      STREET: "רחוב",
      BUILDING_NUMBER: "מספר בית",
      SHORT_HOURS_GRADE: "קיצור שעות העבודה",
      SHIFTING_HOURS_GRADE: "הזזת זמן הגעה לעבודה",
      BICYCLE_GRADE: "דו גלגלי-אופניים",
      SCOOTER_GRADE: "דו גלגלי-קורקינט",
      PERSONALIZED_SHUTTLE_GRADE: "Shuttle On Demand",
      WORK_SHUTTLE_GRADE: "שאטלים מטעם העבודה",
      CARSHARE_GRADE: "Carshare/Vanshare",
      CARPOOL_GRADE: "Carpool/Vanpool",
      CABSHARE_GRADE: "מוניות שיתופיות",
      PUBLIC_TRANSPORT_GRADE: "תחבורה ציבורית (רכבת/רכבת קלה/אוטובוס/מונית שירות)",
      WALKING_GRADE: "הגעה רגלית",
      WORKING_FROM_HOME_GRADE: "עבודה מהבית",
      SHARED_WORKSPACE_GRADE: "עבודה במרכזים שיתופיים",
      SHIFTING_WORKING_DAYS_GRADE: "שינוי ימי הגעה לעבודה"
   }
};