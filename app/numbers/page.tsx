"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { BASE_URL } from "@/api";

interface PairData {
  ID1: number;
  number1: number;
  ID2: number;
  number2: number;
  sum: number;
}

const Page = () => {
  const [pairs, setPairs] = useState<PairData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);

  const fetchPairs = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/numbers`);
      if (!res.ok) throw new Error("Failed to fetch numbers");
      const data = await res.json();
      setPairs(data);
    } catch (err) {
      console.error(err);
      setError("Could not load numbers from the database.");
    }
  };


  const handleSubmit = async () => {
    setError(null);
    setInputError(false);
  
    if (inputValue.trim() === "") {
      setInputError(true);
      return;
    }
  
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setError("Please enter a valid number.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}api/numbers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: value }),
      });
  
      if (!res.ok) throw new Error("Failed to save number.");
      setInputValue("");
      fetchPairs();
    } catch (err) {
      console.error(err);
      setError("Error saving the number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Numbers Page
        </Typography>

        <Stack spacing={2} direction="row" alignItems="center" mb={4}>
          <TextField
            type="number"
            label="Enter a number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError(false);
            }}
            size="small"
            required
            error={inputError}
            helperText={inputError ? "Number is required" : ""}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
        </Stack>
       
        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h6" gutterBottom>
          Adjacent Pairs and Their Sums
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID 1</TableCell>
                <TableCell>Number 1</TableCell>
                <TableCell>ID 2</TableCell>
                <TableCell>Number 2</TableCell>
                <TableCell>Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                pairs.map((pair, index) => (
                  <TableRow key={index}>
                    <TableCell>{pair?.ID1}</TableCell>
                    <TableCell>{pair?.number1}</TableCell>
                    <TableCell>{pair?.ID2}</TableCell>
                    <TableCell>{pair?.number2}</TableCell>
                    <TableCell>{pair?.sum}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Page;
