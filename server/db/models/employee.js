module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employees", {
        EMPLOYER_ID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'Employer',
                // This is the column name of the referenced model
                key: 'id'
            }    
        },
        WORKER_ID: {
            type: Sequelize.STRING(80),
            allowNull: false,
        },
        CITY: {
            type: Sequelize.STRING(45),
            allowNull: false
        },   
        STREET: {
            type: Sequelize.STRING(45),
            allowNull: false
        },   
        BUILDING_NUMBER: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        X: {
            type: Sequelize.DECIMAL(9,3),
            allowNull: true,
        },
        Y: {
            type: Sequelize.DECIMAL(9,3),
            allowNull: true,
        },
        WORK_SITE: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                // This is a reference to another model
                model: 'EmployerSites',
                // This is the column name of the referenced model
                key: 'id'
            }            
        },
        BEST_ROUTE_TO_WORK: {
            type: Sequelize.JSON
        },
        BEST_ROUTE_TO_HOME: {
            type: Sequelize.JSON
        },
        EXIT_HOUR_TO_WORK: {
            type: Sequelize.INTEGER,
            references: {
                // This is a reference to another model
                model: 'TimeSlots',
                // This is the column name of the referenced model
                key: 'ID'
            }            
        },
        RETURN_HOUR_TO_HOME: {
            type: Sequelize.INTEGER,
            references: {
                // This is a reference to another model
                model: 'TimeSlots',
                // This is the column name of the referenced model
                key: 'ID'
            }            
        },
        SHORT_HOURS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        SHIFTING_HOURS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BICYCLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        SCOOTER_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        PERSONALIZED_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        WORK_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        CARSHARE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        CARPOOL_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        CABSHARE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        PUBLIC_TRANSPORT_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        WALKING_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        WORKING_FROM_HOME_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        SHARED_WORKSPACE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        SHIFTING_WORKING_DAYS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_SHORT_HOURS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_SHIFTING_HOURS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_BICYCLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_SCOOTER_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_PERSONALIZED_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_WORK_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_CARSHARE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_CARPOOL_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_CABSHARE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_PUBLIC_TRANSPORT_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_WALKING_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_WORKING_FROM_HOME_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_SHARED_WORKSPACE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_SHIFTING_WORKING_DAYS_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        UPLOAD_ERROR: {
            type: Sequelize.JSON
        }, 
        BEST_ROUTE_TO_HOME_WALKING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_WALKING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_DRIVING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_DRIVING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_TRANSIT_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_TRANSIT_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_BICYCLING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_HOME_BICYCLING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_WALKING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_WALKING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_DRIVING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_DRIVING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_TRANSIT_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_TRANSIT_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_BICYCLING_DISTANCE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        BEST_ROUTE_TO_WORK_BICYCLING_DURATION: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }         
    });
    return Employee;
  };

