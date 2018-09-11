import React from "react";

export const Project = ({project: {name, projectDescription, candidateDescription, skills, id}}) => {
  return (
    <div key={`project${id}`} style={{marginBottom: 2 + 'rem'}}>
      <div style={{fontWeight: 500, marginTop: 1 + 'rem', marginBottom: 1 + 'rem'}}>{name}</div>
      <div style={{color: '#4b709d', marginBottom: 1 + 'rem'}}>
        Technologies: <span>{skills.map((skill) => skill.name).join(', ')}</span>
      </div>
      <div style={{marginBottom: 0.5 + 'rem', textAlign: 'justify'}}>{projectDescription}</div>
      <div style={{textAlign: 'justify'}}>{candidateDescription}</div>
    </div>
  )
};