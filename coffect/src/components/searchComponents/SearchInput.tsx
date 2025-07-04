import React from 'react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  isButtonActive: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isButtonActive,
}) => {
  return (
    <div className="w-full max-w-md flex mb-4">
      <input
        type="text"
        placeholder="사용자 아이디 또는 사용자 이름"
        className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className={`px-4 py-2 rounded-r-md text-white ${isButtonActive ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
        onClick={handleSearch}
        disabled={!isButtonActive}
      >
        검색
      </button>
    </div>
  );
};

export default SearchInput;
