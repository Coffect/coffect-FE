import React, { useState, useEffect } from "react";
import SearchInput from "../components/searchComponents/SearchInput";
import SearchResultList from "../components/searchComponents/SearchResultList";
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
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  useEffect(() => {
    setIsButtonActive(searchTerm.length >= 2);
  }, [searchTerm]);

  const handleSearch = () => {
    // In a real application, this would make an API call
    console.log("Searching for:", searchTerm);
    // Mock data for demonstration
    const mockUsers: User[] = [
      {
        id: "user1",
        username: "JohnDoe",
        profileImage: "https://via.placeholder.com/50",
        major: "Computer Science",
        studentId: "202012345",
      },
      {
        id: "user2",
        username: "JaneSmith",
        profileImage: "https://via.placeholder.com/50",
        major: "Electrical Engineering",
        studentId: "201909876",
      },
      {
        id: "user3",
        username: "PeterJones",
        profileImage: "https://via.placeholder.com/50",
        major: "Mechanical Engineering",
        studentId: "202100112",
      },
    ];

    const filteredResults = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSearchResults(filteredResults);
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-grow flex-col items-center p-4">
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          isButtonActive={isButtonActive}
        />
        <SearchResultList
          searchResults={searchResults}
          searchTerm={searchTerm}
          isButtonActive={isButtonActive}
        />
      </div>
      <BottomNavbar activeLabel="커뮤니티" />
    </div>
  );
};

export default Search;
