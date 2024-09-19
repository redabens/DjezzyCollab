import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/SiteTable.css";

export default function SiteTable({ lignes, selectedRow, setSelectedRow }) {
  const [change, setChange] = useState(false);
  const handleRadioChange = (nouveauId) => {
    setSelectedRow((prev) => {
      return { ancienId: prev.selectedId, selectedId: nouveauId };
    });
    setChange(true);
  };

  const columns = [
    {
      field: "radio",
      headerName: "",
      width: 85,
      renderCell: (params) => (
        <Radio
          checked={selectedRow.selectedId === params.id}
          onChange={() => handleRadioChange(params.id)}
        />
      ),
      headerAlign: "center", // Center the header text
      align: "center", // Center the cell content
    },
    // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: "host",
      headerName: "Host",
      type: "string",
      width: 160,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "port",
      headerName: "Port",
      type: "number",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "username",
      headerName: "Username",
      type: "string",
      width: 220,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "password",
      headerName: "Password",
      type: "string",
      width: 220,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
    {
      field: "defaultPath",
      headerName: "Default Path",
      type: "string",
      width: 320,
      headerAlign: "center",
      align: "center",
      sortable: false,
    },
  ];
  const rows = lignes.map((ligne) => {
    return {
      id: ligne._id,
      host: ligne.host,
      port: ligne.port,
      username: ligne.username,
      password: ligne.password,
      defaultPath: ligne.defaultPath,
      radio: ligne.checked,
    };
  });
  const handleSauv = async (ancienId, nouveauId) => {
    axios
      .patch(`http://localhost:3000/sitesftp/edit/${nouveauId}`, {ancienId:ancienId})
      .then((res) => {
        if (res.status === 200) {
          setChange(false);
          console.log("Site SFTP checked");
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404)
            return alert("Failed to update ancien site SFTP");
          else if (error.response.status === 409)
            return alert("Failed to update nouveau site SFTP");
          else if (error.response.status === 500)
            return alert("Failed to update site SFTP due to server");
        } else {
          console.log(error);
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <div className="site-table">
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeader": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& ::-webkit-scrollbar-y": {
              width: "8px",
            },
          }}
        />
      </Paper>
      {change && (
        <button
          className="sauv"
          onClick={() => {
            handleSauv(selectedRow.ancienId, selectedRow.selectedId);
          }}
        >
          Sauvegarder
        </button>
      )}
    </div>
  );
}
