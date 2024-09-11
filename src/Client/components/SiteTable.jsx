import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SiteTable({lignes,selectedRow,setSelectedRow}) {
    const handleRadioChange = (ancienId,nouveauId) => {
        setSelectedRow(nouveauId);
        // axios.patch(`http://localhost:3000/siteSftp/edit/${nouveauId}`,ancienId)
        // .then((res)=>{
        //     if(res.status === 200){
        //         console.log("Site SFTP checked");
        //     }
        // }).catch((error)=>{
        //   if(error.response){
        //     if(error.response.status === 404) return alert("Failed to update ancien site SFTP");
        //     else if(error.response.status === 409) return alert("Failed to update nouveau site SFTP");
        //     else if(error.response.status === 500) return alert("Failed to update site SFTP due to server");
        //   }else{
        //     console.log(error);
        //     alert("An unexpected error occurred. Please try again.");
        //   }
        // });
    };
    const columns = [
        {
          field: 'radio',
          headerName: '',
          width: 85,
          renderCell: (params) => (
            <Radio
              checked={selectedRow === params.id}
              onChange={() => handleRadioChange(selectedRow,params.id)}
            />
          ),
          headerAlign: 'center',  // Center the header text
          align: 'center',  // Center the cell content
        },
        // { field: 'id', headerName: 'ID', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'host', headerName: 'Host', type: 'string', width: 160, headerAlign: 'center', align: 'center' ,sortable: false,},
        { field: 'port', headerName: 'Port', type: 'number', width: 100, headerAlign: 'center', align: 'center' ,sortable: false,},
        { field: 'username', headerName: 'Username', type: 'string', width: 220, headerAlign: 'center', align: 'center' ,sortable: false,},
        { field: 'password', headerName: 'Password', type: 'string', width: 220, headerAlign: 'center', align: 'center' ,sortable: false,},
        { field: 'defaultPath', headerName: 'Default Path', type: 'string', width: 320, headerAlign: 'center', align: 'center' ,sortable: false,},

    ];
    const rows = lignes.map((ligne)=>{
        return {id:ligne._id,host: ligne.host, port: ligne.port, username: ligne.username,password:ligne.password,defaultPath:ligne.defaultPath,radio:ligne.checked}
    });
    // setSelectedRow(()=>{
    //     return rows.filter((row)=>{
    //         return row.checked;
    //     }).id;
    // })
    //   const rows = [
    //     { id: 1, host: '127.0.0.1', port: 22, username: 'redabens' ,password:'Redabens2004..',defaultPath:'/Downloads/public',checked:false},
    //     { id: 2, host: '192.168.1.66', port: 22, username: 'redabens' ,password:'Redabens2004..',defaultPath:'/Downloads/public',checked:true},
    //   ];
      const paginationModel = { page: 0, pageSize: 5 };
      return (
        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0,
                '& .MuiDataGrid-columnHeader': {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
             }}
          />
        </Paper>
      );    
}