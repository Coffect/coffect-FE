/*
author : 강신욱
description : 커뮤니티 상대 검색 입력에 대한 컴포넌트입니다.
*/

import React from "react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  onClearAndNavigate: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  onClearAndNavigate,
}) => {
  const isSearchActive = searchTerm.length >= 2;

  return (
    <div className="mb-4 flex w-full max-w-md gap-2 text-xs">
      <input
        type="text"
        placeholder="사용자 아이디와 이름을 검색할 수 있습니다. (최소 2자)"
        className="flex-grow border-2 p-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* 
      2자 미만 입력 시에 X 버튼 => x 버튼 클릭 시에 커뮤니티 페이지로 이동
      2자 이상 입력 시에 검색 버튼 => 검색 버튼 클릭 시에 검색 실행
      */}
      {!isSearchActive ? (
        <button
          className="flex w-13 items-center justify-center bg-black px-4 py-2 text-white"
          onClick={onClearAndNavigate}
        >
          X
        </button>
      ) : (
        <button
          className="flex w-13 items-center justify-center bg-black px-4 py-2 text-white"
          onClick={handleSearch}
          disabled={!isSearchActive}
        >
          O
        </button>
      )}
    </div>
  );
};

export default SearchInput;
