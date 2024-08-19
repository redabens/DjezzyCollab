import { useState } from "react";
import "./../styles/GestionUsers.css";
import DisplayUserComponent from "../components/DisplayUserComponent";
import { UsersList } from "../../../src/Server/seeds/usersSeed.cjs";
export default function GestionUsers() {
  const [query, setQuery] = useState("");
  const searchKeys = ["firstName", "lastName", "email"];
  console.log(query);
  const search = (data) => {
    const regxp = new RegExp(query,'gi');
    return data.filter((item) =>{
      const pseudoquery = `${item[searchKeys[0]]} ${item[searchKeys[1]]} ${item[searchKeys[2]]}`;
      return pseudoquery.match(regxp);
    }
    );
  };
  const filteredUsers = search(UsersList);
  return (
    <div className="gestion-users-page">
      <h2>Gestion des utilisateurs</h2>
      <div className="area2">
        <div className="search-bar">
          <img
            src="./../../src/assets/search_loop.svg"
            alt="search_icon"
            width="26px"
            height="26px"
          />
          <input
            type="text"
            placeholder="Recherche..."
            className="search-input"
            onChange={(e) => setQuery(e.target.value.toLocaleLowerCase())}
          />
        </div>
      </div>
      <div className="users-list-area">
        <div className="users-box">
          <div className="users-tools-rectangle">
            <div className="filter-component">
              <p>Filtrer</p>
              <img
                src="./../../src/assets/filter-square.svg"
                alt="filtrer_icon"
                height="20px"
                width="20px"
              />
            </div>
          </div>
          {filteredUsers.map((user) => (
            <DisplayUserComponent key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
