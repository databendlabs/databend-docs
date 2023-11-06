function Steps({ steps }: any) {
  return (
    <div>
      {steps.map((content: any, index: number) => (
         <div className="step-container">
         <div className="step-number">{index+1}.</div>
         <div className="step-content" dangerouslySetInnerHTML={{ __html: content }}></div>
       </div>
      ))}
    </div>
  );
}

export default Steps;