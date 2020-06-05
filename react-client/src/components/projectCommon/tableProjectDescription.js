import React from 'react';
import { DirectionalHint, Icon, TooltipHost } from 'office-ui-fabric-react';
import { linkify } from '../../service/utils';
import copy from 'copy-to-clipboard';

export const TableProjectDescription = ({ description }) => (
  <TooltipHost
    content={
      <span className="table-project-description">
        <span dangerouslySetInnerHTML={{ __html: linkify(description) }}/>
        <Icon iconName="copy" styles={{ className: 'copy-icon' }} onClick={() => copy(description)}/>
      </span>}
    calloutProps={{gapSpace: 0}}
    closeDelay={150}
    directionalHint={DirectionalHint.leftBottomEdge}
  >
    {description}
  </TooltipHost>
);
