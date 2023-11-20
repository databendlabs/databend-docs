import React from 'react';
import VideoFrame from '@site/src/components/VideoFrame/video-frame';
function StartedQuickly() {
  return (
    <div style={{display: 'flex', gap: '20px',flexWrap: 'wrap'}}>
      <VideoFrame 
        img="overview.png"
        title="Databend Cloud 快速开始"
        url="https://www.bilibili.com/video/BV1pV4y1r7Y3/?share_source=copy_web&vd_source=470d4147e4d79d25bbacd193a2cf39fe"
      />
      <VideoFrame 
        background="linear-gradient(180deg, #FF57DA 0%, #00194D 100%)"
        img="worksheet.png"
        title="工作区 (Worksheet) 快速开始"
        url="https://www.bilibili.com/video/BV1vu4y1Z7Zn/?share_source=copy_web&vd_source=470d4147e4d79d25bbacd193a2cf39fe"
      />
      <VideoFrame 
        background="linear-gradient(180deg, #01CFC3 0%, #00194D 100%)"
        img="database.png"
        title="Database 快速开始"
        url="https://www.bilibili.com/video/BV16s4y1k7EF/?spm_id_from=333.999.0.0&vd_source=587d4520a94f6ed41ba6e08112518342"
      />
    </div>
  )
}

export default StartedQuickly;