import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/communityComponents/searchComponents/SearchInput";
import SearchResultList from "../components/communityComponents/searchComponents/SearchResultList";
import BottomNavbar from "../components/shareComponents/BottomNavbar";

interface User {
  id: string;
  username: string;
  profileImage: string;
  major: string;
  studentId: string;
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // 변경: 검색 수행 여부를 추적하는 상태 추가
  const navigate = useNavigate();

  const handleSearch = () => {
    // In a real application, this would make an API call
    console.log("Searching for:", searchTerm);
    // Mock data for demonstration
    const mockUsers: User[] = [
      {
        id: "@kimghan_0725",
        username: "JohnDoe",
        profileImage: "https://via.placeholder.com/50",
        major: "TESL 전공",
        studentId: "24학번",
      },
      {
        id: "@kimghan_0725",
        username: "JaneSmith",
        profileImage: "https://via.placeholder.com/50",
        major: "컴퓨터공학 전공",
        studentId: "20학번",
      },
      {
        id: "@kimghan_0725",
        username: "PeterJones",
        profileImage: "https://via.placeholder.com/50",
        major: "미디어커뮤니케이션 전공",
        studentId: "22학번",
      },
    ];

    const filteredResults = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(filteredResults);
    setHasSearched(true); // 변경: 검색이 수행되었음을 표시
  };

  const handleClearAndNavigate = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false); // 변경: 검색 상태 초기화
    navigate("/community");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow flex-col items-center p-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          onClearAndNavigate={handleClearAndNavigate}
        />
        <SearchResultList
          searchResults={searchResults}
          searchTerm={searchTerm}
          hasSearched={hasSearched} // 변경: hasSearched prop 전달
        />
      </div>
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Search;
