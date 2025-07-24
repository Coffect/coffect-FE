import React from "react";

const TestUnfixableComponent = () => {
  // 수정 불가능한 오류들
  console.log(undefinedVariable); // 정의되지 않은 변수
  const name: string = 123; // 타입 불일치
  const test = ; // 문법 오류
  
  return (
    <div>
      <h1>Test Unfixable Component</h1>
    </div>
  );
};

export default TestUnfixableComponent; 