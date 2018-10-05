import React from "react";
import {EmployeeOnProject} from "./employeeOnProject";

export const CompanyProject = ({project: {name, description, team, skills, id, startDate, durationMonths: duration}}) => {
  return (
    <div key={`project${id}`} className="company-project">
      <div className="company-project-head">
        <div className="company-project-title">{name}</div>
        <div className="company-project-time">
          <span>
            Started at: {new Date(startDate).toDateString()}
          </span>
          <span>
          Duration: {`${duration} Month${duration > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
      <div className="company-project-technologies">
        Technologies: <span>{skills.map((skill) => skill.name).join(', ')}</span>
      </div>
      <div className="company-project-description">{description}</div>
      {team.map((employee, index) => <EmployeeOnProject key={index} employee={employee}/>)}
    </div>
  )
};