
// Copyright 2023 DatabendLabs.
import React, { FC, ReactElement, ReactNode } from 'react';
import LinkSvg from '../../icons/link';
import copy from 'copy-to-clipboard';
import Tooltip from '../BaseComponents/Tooltip';
// import { MDXProvider } from '@mdx-js/react';
interface IProps {
  number: number | string;
  children: ReactNode;
  title: string;
  outLink?: string;
}
const StepContent: FC<IProps> = ({number, children, title, outLink}): ReactElement=> {
  return (
    <div className="global-step-container" id={title}>
      <span className="global-step-number">
        {
          number === ''
          ? <span className='global-step-n global-step-point'></span>
          : <span className='global-step-n'>{number}</span> 
        }
       {
         outLink
         ? <a className='anchor global-step-outlink' target='_blank' href={outLink}>{title}</a>
         : 
         <h3 className='anchor'>
          {title}
          <a href={`#${title}`}>
          <Tooltip content="Copy Link">
            <LinkSvg onClick={()=> copy(decodeURIComponent(window.location?.origin+window.location.pathname+'#'+title))}></LinkSvg>
          </Tooltip>
         </a>
        </h3>
       }
        
      </span>
      <div className="step-content">{children}</div>
    </div>
  );
};
export default StepContent;
