import { Box, Button, Grid2, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

export default function Home() {
  // TODO: Fetch workflows from API
  const workflows = [
    { name: "myflow1", id: 1 },
    { name: "myflow2", id: 2 },
  ];

  return (
    <Box sx={{ height: "90vh", width: "100vw" }}>
      <Box sx={{ display: "flex", justifyContent: "left" }}>
        <Typography sx={{ margin: "20px" }} variant="h4">
          AI Workflows
        </Typography>
        <Button
          sx={{ mt: "25px", height: "40px" }}
          variant="contained"
          color="primary"
        >
          <AddIcon />
          Add New
        </Button>
      </Box>
      <Grid2
        container
        sx={{ margin: "20px" }}
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {workflows.map((workflow) => (
          <Grid2 key={workflow.id}>
            {/* TODO: Remove Link in the future. Dont use react routing to open the workflow */}
            <Link to={{ pathname: `/workflow/${workflow.id}` }}>
              <Paper
                elevation={5}
                sx={{
                  width: "300px",
                  height: "150px",
                  padding: "15px",
                  bgcolor: "#1a1919",
                  color: "white",
                  ":hover": { bgcolor: "darkgray", cursor: "pointer" },
                }}
              >
                {workflow.name}
              </Paper>
            </Link>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
