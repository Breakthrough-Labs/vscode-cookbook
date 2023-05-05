import axios from "axios";
import React, { useEffect, useState } from "react";
import { ContractCard } from "./ContractCard";
import Discord from "./discord-mark-white.png";

axios.defaults.baseURL = "https://simple-web3-api.herokuapp.com";

export default function App() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      try {
        const res = await axios.post("/contracts/search", {
          search,
          sort: "popular",
          filter: "",
          page: 1,
          plugin: true,
        });
        // track("Remix: search", { query: search }, userData);
        setContracts(res.data.contracts);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }, 200); // debounce time in milliseconds

    return () => clearTimeout(debounceSearch);
  }, [search]);

  return (
    <div className="p-3">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          href="https://www.cookbook.dev?utm=vscode"
          target="_blank"
          rel="noreferrer noopener"
          style={{
            display: "flex",
            gap: "8px",
            textDecoration: "none",
            marginBottom: "20px",
            color: "var(--vscode-input-foreground)",
          }}
        >
          <img
            src="https://www.cookbook.dev/_next/image?url=https%3A%2F%2Fsmart-contract-recipes.s3.amazonaws.com%2F0x07590a393C67670463b80768fEED264832541d51%2Fcookbook_logo_transparent.png&w=48&q=75"
            width={35}
            height={35}
            alt="Cookbook logo"
          />
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              width: "100%",
              alignSelf: "flex-end",
            }}
          >
            Cookbook.dev
          </div>
        </a>
        <a
          href="https://discord.gg/WzsfPcfHrk"
          target="_blank"
          rel="noreferrer noopener"
          style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
        >
          <img src={Discord} width={16} height={12} />
        </a>
      </div>

      <div class="input-group input-group-sm mb-3 p-0">
        <input
          type="text"
          class="form-control"
          placeholder="Search for contracts"
          onChange={(e) => {
            setSearch(e.target.value);
            setLoading(true);
          }}
          value={search}
        />
      </div>
      {loading ? (
        <div className="card-text">Searching...</div>
      ) : Boolean(contracts.length) ? (
        contracts.map((contract) => <ContractCard key={contract.address} contract={contract} />)
      ) : (
        <div>No contracts found</div>
      )}
    </div>
  );
}
