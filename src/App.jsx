import axios from "axios";
import { DeviceUUID } from "device-uuid";
import React, { useEffect, useState } from "react";
import { ContractCard } from "./ContractCard";
import Discord from "./discord-mark-white.png";

axios.defaults.baseURL = "https://simple-web3-api.herokuapp.com";

const vscode = acquireVsCodeApi();

const track = (metric, data) => {
  let du = new DeviceUUID().parse();
  let dua = [
    du.platform,
    du.resolution,
    du.os,
    du.pixelDepth,
    du.language,
    du.isMac,
    du.isDesktop,
    du.isMobile,
    du.isTablet,
    du.isWindows,
    du.isLinux,
    du.isLinux64,
    du.isiPad,
    du.isiPhone,
    du.isTouchScreen,
    du.cpuCores,
    du.colorDepth,
  ];
  let uuid = du.hashMD5(dua.join(":"));
  data.uuid = uuid;
  vscode.postMessage({
    command: "track",
    data: { metric, data },
  });
};

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
        track("VScode: search", { query: search });
        setContracts(res.data.contracts);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }, 200); // debounce time in milliseconds

    return () => clearTimeout(debounceSearch);
  }, [search]);

  useEffect(() => {
    track("VScode: view plugin", {});
  }, []);

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
          onClick={() => track("VScode: open cookbook", {})}
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
            width={30}
            height={30}
            alt="Cookbook logo"
          />
          <div
            style={{
              fontSize: "large",
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
          onClick={() => {
            track("VScode: Discord Opened", {});
          }}
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
        contracts.map((contract) => (
          <ContractCard
            key={contract.address}
            contract={contract}
            vscode={vscode}
            track={track}
          />
        ))
      ) : (
        <div>No contracts found</div>
      )}
    </div>
  );
}
