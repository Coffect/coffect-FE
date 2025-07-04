import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  isButtonActive: boolean;
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchResults,
  searchTerm,
  isButtonActive,
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
            className="flex items-center p-3 mb-2 bg-white rounded-md shadow cursor-pointer hover:bg-gray-50"
            onClick={() => handleUserClick(user.id)}
          >
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-semibold">{user.username} ({user.id})</p>
              <p className="text-sm text-gray-600">{user.major} ({user.studentId})</p>
            </div>
          </div>
        ))
      ) : searchTerm.length > 0 && isButtonActive ? (
        <div className="text-center text-gray-500 mt-8">
          일치하는 사용자가 없습니다. 글자수를 수정해보세요.
        </div>
      ) : null}
    </div>
  );
};

export default SearchResultList;
