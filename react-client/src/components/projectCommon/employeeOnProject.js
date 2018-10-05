import React from "react";
import axios from "axios";

export const EmployeeOnProject = ({employee: {employeeName, description, skills, id, image}}) => {
  return (
    <div key={`employee${id}`} className="company-project-employee">
      <div className="company-project-employee-main">
        <div className={`company-project-employee-image ${image ? '' : 'missing-img'}`}
             style={{
               backgroundImage: 'url(' + (image ? axios.defaults.baseURL + image : '/missing-photo.svg') + ')'
             }}
        />
        <div>
          <div className="company-project-employee-name">{employeeName}</div>
          <div className="company-project-technologies company-project-employee-technologies">
            <span>{skills.map((skill) => skill.name).join(', ')}</span>
          </div>
        </div>
      </div>
      <div className="company-project-employee-description">{description}</div>
    </div>
  )
};