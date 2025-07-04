/*
author : 강신욱
description : 커뮤니티 상대 검색 후 조회 리스트 컴포넌트입니다.
*/

import React from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  profileImage: string;
  major: string;
  studentId: string;
}

interface SearchResultListProps {
  searchResults: User[];
  searchTerm: string;
  hasSearched: boolean;
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchResults,
  searchTerm,
  hasSearched,
}) => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="w-full max-w-md">
      {searchResults.length > 0 ? (
        searchResults.map((user) => (
          <div
            key={user.id}
            className="mb-2 flex cursor-pointer items-center rounded-md bg-white p-3 shadow"
            onClick={() => handleUserClick(user.id)}
          >
            <img
              src={user.profileImage}
              alt={user.username}
              className="mr-3 h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">
                {user.username} {user.id}
              </p>
              <p className="text-sm text-gray-600">
                {user.major} {user.studentId}
              </p>
            </div>
          </div>
        ))
      ) : hasSearched && searchTerm.length >= 2 ? (
        <div className="mt-8 text-center text-gray-500">
          일치하는 사용자가 없습니다. 글자수를 수정해보세요.
        </div>
      ) : null}
    </div>
  );
};

export default SearchResultList;
