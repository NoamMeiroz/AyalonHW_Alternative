module.exports = {
   DB: "localhost",
   dialect: "mysql",
   dialectOptions: { decimalNumbers: true },
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
      PRIVATE_CAR_SOLUTION: "רכב צמוד",
      MASS_TRANSPORTATION_SOLUTION: "שירות הסעות",
      CAR_POOL_SOLUTION: "Carpool",
      WORK_FROM_HOME_SOLUTION: "עבודה מהבית"
   },
   branchesFieldsName: {
      SITE_ID: "מספר סניף",
      AREA: "מתחם",
      NAME: "שם סניף",
      ADDRESS_CITY: "עיר",
      ADDRESS_STREET: "רחוב",
      ADDRESS_BUILDING_NUMBER: "מספר"
   },
   employeeFieldsName: {
      //WORKER_ID: "מזהה עובד",
      WORKER_ID: "אנא ציין את מספר העובד שלך על מנת שהמעסיק יוכל לחזור אלייך עם הפתרון המתאים ביותר עבורך",
      BRANCH_ID: "מס\"ד סניף",
      SEX: "מהו המגדר שלך?",
      AGE: "מהו גילך?",
      CITY: "Q359|מה העיר ורחוב המגורים שלך? (עיר)",
      STREET: "Q359|רחוב",
      PARKING: "מהו הסדר החניה שלך בעבודה?",
      DRIVING_LICENSE: "האם יש לך רישיון נהיגה?",
      DISTANCE: "מהו מרחק סביר מבחינתך לתחנת איסוף, במידה ומתקיימות הסעות / נסיעות שיתופיות?",
      PREFERED_SULOTIONS: "לפנייך רשימת פתרונות הנוגעים לאופן ההגעה והחזרה. אנא סמן פתרונות בהם תשקול להשתמש אילו היו זמינים במקום העבודה שלך (ניתן לבחור יותר מתשובה אחת)",
      EXIT_HOUR_TO_WORK: "מתי אתה מגיע מהבית לעבודה?",
      RETURN_HOUR_TO_HOME: "מתי אתה יוצא מהעבודה לכיוון הבית?",
      // CITY: "עיר מגורים",
      // STREET: "רחוב",
      // EXIT_HOUR_TO_WORK: "שעת הגעה למקום העבודה",
      // RETURN_HOUR_TO_HOME: "שעת היציאה ממקום העבודה",
      // BUILDING_NUMBER: "מספר בית",
      // SHORT_HOURS_GRADE: "קיצור שעות העבודה",
      // SHIFTING_HOURS_GRADE: "הזזת זמן הגעה לעבודה",
      // BICYCLE_GRADE: "דו גלגלי-אופניים",
      // SCOOTER_GRADE: "דו גלגלי-קורקינט",
      // PERSONALIZED_SHUTTLE_GRADE: "Shuttle On Demand",
      // WORK_SHUTTLE_GRADE: "שאטלים מטעם העבודה",
      // CARSHARE_GRADE: "Carshare/Vanshare",
      // CARPOOL_GRADE: "Carpool/Vanpool",
      // CABSHARE_GRADE: "מוניות שיתופיות",
      // PUBLIC_TRANSPORT_GRADE: "תחבורה ציבורית (רכבת/רכבת קלה/אוטובוס/מונית שירות)",
      // WALKING_GRADE: "הגעה רגלית",
      // WORKING_FROM_HOME_GRADE: "עבודה מהבית",
      // SHARED_WORKSPACE_GRADE: "עבודה במרכזים שיתופיים",
      // SHIFTING_WORKING_DAYS_GRADE: "שינוי ימי הגעה לעבודה"
   },
   DEFAULT_EXIT_HOUR_TO_WORK: 2,
   DEFAULT_RETURN_HOUR_TO_HOME: 7
};