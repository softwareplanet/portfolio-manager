import React from "react";
import {ProjectLogo} from "../common/projectLogo";

export const Project = ({project: {name, projectDescription, candidateDescription, skills, image, id}}) => {
  return (
    <div key={`project${id}`} style={{marginBottom: 2 + 'rem'}}>
      <div style={{fontWeight: 500, marginTop: 1 + 'rem', marginBottom: 1 + 'rem', display: 'flex', itemAligns: 'center'}}>
        <div style={{height: 2 + 'rem', width: 2 + 'rem', marginRight: '1rem'}}>
          <ProjectLogo url={image}/>
        </div>
        {name}
      </div>
      <div style={{color: '#4b709d', marginBottom: 1 + 'rem'}}>
        Technologies: <span>{skills.map((skill) => skill.name).join(', ')}</span>
      </div>
      <div style={{marginBottom: 0.5 + 'rem', textAlign: 'justify'}}>{projectDescription}</div>
      <div style={{textAlign: 'justify'}}>{candidateDescription}</div>
    </div>
  )
};