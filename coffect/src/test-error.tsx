import React from "react";

const TestErrorComponent = () => {
  const unusedVariable = "test"; // ESLint 오류: 사용하지 않는 변수
  const badFormatting = ; // Prettier 오류: 공백 없음

  return (
    <div>
      <h1>Test Error Component</h1>
    </div>
  );
};

export default TestErrorComponent;
