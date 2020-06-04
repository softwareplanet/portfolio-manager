import React from 'react';
import axios from 'axios';
import { Icon } from 'office-ui-fabric-react';

const imageFileExtensions = [
  'ase',
  'art',
  'bmp',
  'blp',
  'cd5',
  'cit',
  'cpt',
  'cr2',
  'cut',
  'dds',
  'dib',
  'djvu',
  'egt',
  'exif',
  'gif',
  'gpl',
  'grf',
  'icns',
  'ico',
  'iff',
  'jng',
  'jpeg',
  'jpg',
  'jfif',
  'jp2',
  'jps',
  'lbm',
  'max',
  'miff',
  'mng',
  'msp',
  'nitf',
  'ota',
  'pbm',
  'pc1',
  'pc2',
  'pc3',
  'pcf',
  'pcx',
  'pdn',
  'pgm',
  'PI1',
  'PI2',
  'PI3',
  'pict',
  'pct',
  'pnm',
  'pns',
  'ppm',
  'psb',
  'psd',
  'pdd',
  'psp',
  'px',
  'pxm',
  'pxr',
  'qfx',
  'raw',
  'rle',
  'sct',
  'sgi',
  'rgb',
  'int',
  'bw',
  'tga',
  'tiff',
  'tif',
  'vtf',
  'xbm',
  'xcf',
  'xpm',
  '3dv',
  'amf',
  'ai',
  'awg',
  'cgm',
  'cdr',
  'cmx',
  'dxf',
  'e2d',
  'egt',
  'eps',
  'fs',
  'gbr',
  'odg',
  'svg',
  'stl',
  'vrml',
  'x3d',
  'sxd',
  'v2d',
  'vnd',
  'wmf',
  'emf',
  'art',
  'xar',
  'png',
  'webp',
  'jxr',
  'hdp',
  'wdp',
  'cur',
  'ecw',
  'iff',
  'lbm',
  'liff',
  'nrrd',
  'pam',
  'pcx',
  'pgf',
  'sgi',
  'rgb',
  'rgba',
  'bw',
  'int',
  'inta',
  'sid',
  'ras',
  'sun',
  'tga',
];

export const Attachment = ({ file, onDeleteFile }) => {
  const fileName = file.file.split('/').slice(-1)[ 0 ];
  const extension = fileName.split('.').slice(-1)[ 0 ];
  const isImage = imageFileExtensions.includes(extension);

  return (
    <div
      className="attachment"
    >
      <div className="attachment-image">
        <img src={ isImage
                    ? axios.defaults.baseURL + file.file
                    : '/file.svg' }
             className="attachment-image-img"
             alt="Your avatar"
             {...(isImage ? {} : { width: '30%' })}
        />
      </div>
      <div className="attachment-footer">
        <div>
          <div className="attachment-footer-text">
            <a href={axios.defaults.baseURL + file.file} target="_blank">{fileName}</a>
            { file.group.name }
          </div>
        </div>
        <Icon iconName="delete" className="attachment-delete" onClick={() => onDeleteFile(file)}/>
      </div>
    </div>
  );
};
