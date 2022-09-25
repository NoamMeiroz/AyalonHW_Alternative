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
        FINAL_BICYCLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_WORK_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_COMPOUND_SHUTTLE_GRADE: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        FINAL_CARPOOL_GRADE: {
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
        },
        TOP_SOLUTION_1: {
            type: Sequelize.STRING(45),
            allowNull: true 
        },
        TOP_SOLUTION_2: {
            type: Sequelize.STRING(45),
            allowNull: true 
        },
        TOP_SOLUTION_3: {
            type: Sequelize.STRING(45),
            allowNull: true 
        },
        TOP_SOLUTION_4: {
            type: Sequelize.STRING(45),
            allowNull: true 
        },
        TOP_SOLUTION_5: {
            type: Sequelize.STRING(45),
            allowNull: true 
        },
        BICYCLE_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            }            
        },
        WORK_SHUTTLE_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            } 
        },
        COMPOUND_SHUTTLE_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            } 
        },
        CARPOOL_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            } 
        },
        PUBLIC_TRANSPORT_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            } 
        },
        WALKING_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            } 
        },
        WORKING_FROM_HOME_DISQUALIFY_REASON: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                // This is a reference to another model
                model: 'SoltionDisqualifyReason',
                // This is the column name of the referenced model
                key: 'ID'
            }
        },
    });
    return Employee;
  };

