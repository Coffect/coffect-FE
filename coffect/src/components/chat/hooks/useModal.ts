<<<<<<< HEAD
/*
 * author : 앨리스/박은지
 * description : [상대 요청 보기] 모달 훅
 * 모달 컴포넌트 열고 닫는 핸들러 제공
 */
=======
// author : 앨리스/박은지
/*
 * description : [상대 요청 보기] 모달 훅
 */
// 모달 컴포넌트 열고 닫는 핸들러 제공
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb

import { useState, useCallback } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
};

export default useModal;
