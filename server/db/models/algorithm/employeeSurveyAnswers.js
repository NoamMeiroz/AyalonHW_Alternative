module.exports = (sequelize, Sequelize) => {
    var EmployeeSurveyAnswers = sequelize.define("employee_survey_answers", {
        EMPLOYEE_ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'Employee',
                // This is the column name of the referenced model
                key: 'id'
            }
        },
        JOB_TYPE: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        PERMANENT_CAR: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        PARKING: {
            type: Sequelize.STRING,
            allowNull: true
        },
        DRIVING_LICENSE: {
            type: Sequelize.STRING,
            allowNull: true
        },
        SEX: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        AGE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        PICKUP_DISTANCE: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        PREFFERED_SOLUTIONS: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        TRANSPORT_PROBLEM: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        MAIN_SOLUTION_TRASPORTION_TO_WORK: {
            type: Sequelize.JSON,
            allowNull: true,
        },
        ELECTRIC_CAR: {
            type: Sequelize.STRING,
            allowNull: true
        },
        WORK_FROM_HOME: {
            type: Sequelize.STRING,
            allowNull: true
        },
        EXTRA_INPUT: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        IS_DIFFICULTS_TO_ARRIVE_WORK_HOME: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        HAS_CHILDREN: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        PICKUP_CHILDREN: {
            type: Sequelize.STRING,
            allowNull: true
        }
        
    },
        {
            freezeTableName: true
        });
    return EmployeeSurveyAnswers;
};