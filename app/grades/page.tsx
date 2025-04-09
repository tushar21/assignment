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
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Alert,
} from "@mui/material";
import Navbar from "@/components/Navbar";
import { BASE_URL } from "@/api";

interface Grade {
    id?: number;
    class: string;
    grade: number;
}

const Page = () => {
    const [grades, setGrades] = useState<Grade[]>([]);
    const [filter, setFilter] = useState("all");

    const [newClass, setNewClass] = useState("");
    const [newGrade, setNewGrade] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const classOptions = ["Math", "Science", "History"];

    const fetchGrades = async (type: string) => {
        try {
            const res = await fetch(`${BASE_URL}api/grades?filter=${type}`);
            const data = await res?.json();
            setGrades(data);
            setFilter(type);
        } catch (err) {
            console.error("Failed to fetch grades:", err);
        }
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");
        const numericGrade = Number(newGrade);
        if (!newClass || !classOptions?.includes(newClass)) {
            setError("Please select a valid class.");
            return;
        }

        if (newGrade.trim() === "" || isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
            setError("Grade must be a number between 0 and 100.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}api/grades`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sub: newClass, grade: numericGrade }),
            });

            if (!res?.ok) throw new Error("Failed to add grade");

            setSuccess("Grade added successfully.");
            setNewClass("");
            setNewGrade("");
            fetchGrades(filter);
        } catch (err) {
            setError("Error adding grade. Please try again.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGrades("all");
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />

                <Box component={Paper} sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Add New Grade
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                        <FormControl sx={{ minWidth: 250 }} error={!!error && (!newClass || !classOptions.includes(newClass))}>
                            <InputLabel>Class</InputLabel>
                            <Select
                                value={newClass}
                                onChange={(e) => setNewClass(e.target.value)}
                                label="Class"
                            >
                                {classOptions.map((cls) => (
                                    <MenuItem key={cls} value={cls}>
                                        {cls}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Grade"
                            type="number"
                            value={newGrade}
                            onChange={(e) => setNewGrade(e.target.value)}
                            inputProps={{ min: 0, max: 100 }}
                            sx={{ width: 250 }}
                            error={!!error && (newGrade.trim() === "" || isNaN(Number(newGrade)) || Number(newGrade) < 0 || Number(newGrade) > 100)} />


                        <Button variant="contained" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>

                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                </Box>
                <Typography variant="h5" gutterBottom>
                    Welcome to Grades Screen
                </Typography>

                <Stack direction="row" spacing={2} mb={3}>
                    <Button variant={filter === "all" ? "contained" : "outlined"} onClick={() => fetchGrades("all")}>
                        Show All Data
                    </Button>
                    <Button variant={filter === "averages" ? "contained" : "outlined"} onClick={() => fetchGrades("averages")}>
                        Class Averages
                    </Button>
                    <Button variant={filter === "passing" ? "contained" : "outlined"} onClick={() => fetchGrades("passing")}>
                        Passing Average
                    </Button>
                    <Button variant={filter === "highperforming" ? "contained" : "outlined"} onClick={() => fetchGrades("highperforming")}>
                        High Performing Classes
                    </Button>
                </Stack>


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {filter === "all" && <TableCell>ID</TableCell>}
                                <TableCell>Class</TableCell>
                                <TableCell>Grade</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {grades.map((row, idx) => (
                                <TableRow key={idx}>
                                    {filter === "all" && <TableCell>{row?.id}</TableCell>}
                                    <TableCell>{row?.class}</TableCell>
                                    <TableCell>{row?.grade}</TableCell>
                                </TableRow>
                            ))}
                            {grades.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={filter === "all" ? 3 : 2} align="center">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Page;
