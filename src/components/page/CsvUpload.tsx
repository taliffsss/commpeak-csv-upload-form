import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { List } from "../DataTable/Columns";
import { Channel } from "../Utils/Channel";
import Pusher from "pusher-js";

const CsvUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async (page: number, perPage: number) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/list?page=${page}&limit=${perPage}`,
        {
          headers: {
            "X-API-KEY": process.env.REACT_APP_NAME,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setData(response.data.data);
      }
      setTotalRows(response.data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setCurrentPage(page);
    setPerPage(newPerPage);
    fetchUsers(page, newPerPage);
  };

  useEffect(() => {
    fetchUsers(currentPage, perPage); // Fetch users on initial load
    const pusher = new Pusher(`${process.env.REACT_APP_PUSHER_KEY}`, {
      cluster: `${process.env.REACT_APP_PUSHER_CLUSTER}`,
    });

    const listRefresh = pusher.subscribe(Channel.STATISTIC_LIST_REFRESH);

    listRefresh.bind(`STATISTIC_LIST_REFRESH`, (data: any) => {
      console.log(data);
      fetchUsers(currentPage, perPage);
    });
  }, [currentPage, perPage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Adjust the API URL as per your Symfony API endpoint
      const apiUrl = "http://localhost:8000/upload"; // Replace with your API URL

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": process.env.REACT_APP_NAME,
        },
      });

      console.log("File uploaded successfully", response);
      setFile(null);
      // Add further logic as needed for success handling
    } catch (error) {
      console.error("Error uploading file", error);
      // Add logic for error handling
    }
  };

  return (
    <div className="container">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">CSV Upload</h1>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border p-2 mb-4"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload
        </button>

        <DataTable
          title="Statistics"
          columns={List}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CsvUpload;
